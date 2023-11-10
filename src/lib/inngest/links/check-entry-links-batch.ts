import { Document, Block, Inline, Text } from '@contentful/rich-text-types'

import inngest from '@/lib/inngest/client'
import { getEntries, editLink } from '@/lib/contentful'

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
    id: 'links-check-entry-links-batch',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'links/check.entry-links-batch',
  },
  async ({
    step,
    event: {
      data: { type, ids },
    },
  }) => {
    const entries = await step.run('Get entry content links', async () => {
      const entries = await getEntries({ content_type: type, 'sys.id[in]': ids.toString() })

      return entries.map((entry) => {
        const {
          fields: { name, content },
        } = entry
        return {
          name,
          edit: editLink(entry),
          urls: findUrls(content),
        }
      })
    })

    let total = 0

    for (const entry of entries) {
      const { name, edit, urls } = entry
      for (const url of urls) {
        total++
        await step.sendEvent('Dispatch check link event', {
          name: 'links/check.link',
          data: {
            type,
            name,
            edit,
            url,
          },
        })
      }
    }

    return {
      done: true,
      dispatched: total,
    }
  }
)
