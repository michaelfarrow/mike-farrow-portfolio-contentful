import inngest from '@/lib/inngest/client'
import { Document, Block, Inline, Text } from '@contentful/rich-text-types'

import { getEntries } from '@/lib/contentful'

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

export default inngest.createFunction(
  {
    id: 'links-check-links',
    concurrency: {
      limit: 1,
    },
  },
  process.env.NODE_ENV === 'production'
    ? { cron: 'TZ=Europe/London 0 16 * * 3' }
    : {
        event: 'links/check.links',
      },
  async ({ step }) => {
    const urlsData = await step.run('Fetch URLs', async () => {
      const links = await getEntries({
        content_type: 'contentLink',
      })

      const projects = await getEntries({
        content_type: 'project',
      })

      return [
        ...links.map(({ fields: { name, url } }) => ({ type: 'Link', name, url })),
        ...projects
          .map(({ fields: { name, content } }) =>
            findUrls(content).map((url) => ({
              type: 'Project',
              name: name,
              url,
            }))
          )
          .flat(),
      ]
    })

    for (const data of urlsData) {
      await step.sendEvent('Dispatch check link event', {
        name: 'links/check.link',
        data,
      })
    }

    return {
      done: true,
      dispatched: urlsData.length,
    }
  }
)
