import inngest from '@/lib/inngest/client'
import axios from 'axios'
import { Document, Block, Inline, Text } from '@contentful/rich-text-types'

import { getEntries, getEntry } from '@/lib/contentful'

function allowedError(e: any) {
  return [
    999, // linkedin not logged in error
  ].includes(e?.response?.status)
}

function findUrls(parent: Document | Block | Inline | Text, links: string[] = []) {
  if ('content' in parent) {
    for (const block of parent.content) {
      if (block.nodeType === 'hyperlink') {
        const url = block.data?.uri
        if (url) links.push(url)
      } else {
        findUrls(block, links)
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

export default inngest.createFunction(
  { id: 'check-links' },
  { event: 'check' },
  async ({ step }) => {
    const linkIds = await step.run('fetch-link-ids', async () => {
      const links = await getEntries({
        content_type: 'contentLink',
      })
      return links.map((link) => link.sys.id)
    })

    const projectIds = await step.run('fetch-project-ids', async () => {
      const projects = await getEntries({
        content_type: 'project',
      })
      return projects.map((project) => project.sys.id)
    })

    for (const projectId of projectIds) {
      const projectInfo = await step.run('fetch-project-information', async () => {
        const project = await getEntry({
          content_type: 'project',
          'sys.id': projectId,
        })

        if (!project) return null

        const { content } = project.fields

        return {
          project: projectId,
          urls: findUrls(content),
        }
      })

      if (projectInfo) {
        for (const url of projectInfo.urls) {
          await step.run('check-project-url', async () => {
            return {
              projectId: projectInfo.project,
              url,
              exists: await checkUrl(url),
            }
          })
        }
      }
    }

    for (const linkId of linkIds) {
      await step.run('check-link-url', async () => {
        const link = await getEntry({
          content_type: 'contentLink',
          'sys.id': linkId,
        })

        if (!link) return { id: linkId, exists: null }

        const { url, name } = link.fields

        return {
          id: linkId,
          url,
          exists: await checkUrl(url),
        }
      })
    }

    return {
      done: true,
    }
  }
)
