require('dotenv').config()

import axios from 'axios'
import { Document, Block, Inline, Text } from '@contentful/rich-text-types'

import { getEntries } from '@/lib/contentful'

type Result = {
  type: string
  name?: string
  url: string
}

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

  const ok: Result[] = []
  const fail: Result[] = []

  const check = async (type: string, name: string, url: string) => {
    console.log('Checking:', [type, name, url].join(' / '))
    ;((await checkUrl(url)) ? ok : fail).push({ type, name, url })
  }

  for (const link of links) {
    const { url, name } = link.fields
    await check('Content > Link', name, url)
  }

  for (const project of projects) {
    const { name, content } = project.fields
    const links = findLinks(content)
    for (const link of links) {
      await check('Project', name, link)
    }
  }

  console.log({ ok, fail })
}

run()
