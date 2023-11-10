import inngest from '@/lib/inngest/client'
import { getEntries, editLink } from '@/lib/contentful'

export default inngest.createFunction(
  {
    id: 'links-check-content-links-batch',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'links/check.content-links-batch',
  },
  async ({
    step,
    event: {
      data: { ids },
    },
  }) => {
    const links = await step.run('Get content links', async () => {
      const links = await getEntries({ content_type: 'contentLink', 'sys.id[in]': ids.toString() })

      return links.map((link) => {
        const {
          fields: { name, url },
        } = link
        return {
          name,
          edit: editLink(link),
          url,
        }
      })
    })

    for (const link of links) {
      await step.sendEvent('Dispatch check link event', {
        name: 'links/check.link',
        data: { type: 'link', ...link },
      })
    }

    return {
      done: true,
      dispatched: links.length,
    }
  }
)
