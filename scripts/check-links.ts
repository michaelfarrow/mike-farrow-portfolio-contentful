require('dotenv').config()

import axios from 'axios'
import { Document, Block, Inline, Text } from '@contentful/rich-text-types'

import { getEntries } from '@/lib/contentful'

function allowedError(e: any) {
  return [
    999, // linkedin not logged in error
  ].includes(e?.response?.status)
}

function findLinks(parent: Document | Block | Inline | Text, links: string[] = []) {
  if ('content' in parent) {
    for (const block of parent.content) {
      if (block.nodeType === 'hyperlink') {
        const url = block.data?.uri
        if (url) links.push(url)
      } else {
        findLinks(block, links)
      }
    }
  }
  return links
}

async function checkUrl(url: string) {
  try {
    await axios.head(url)
  } catch (e) {
    if (allowedError(e)) return true
    try {
      await axios.get(url)
    } catch (e) {
      if (allowedError(e)) return true
      return false
    }
  }
  return true
}

async function run() {
  const links = await getEntries({
    content_type: 'contentLink',
  })

  const projects = await getEntries({
    content_type: 'project',
  })

  for (const link of links) {
    const { url } = link.fields
    const res = await checkUrl(url)
    console.log(url, res)
  }

  for (const project of projects) {
    const { name, content } = project.fields
    if (name == 'Test Project') {
      const links = findLinks(content)
      for (const link of links) {
        const res = await checkUrl(link)
        console.log(link, res)
      }
    }
  }
}

run()
