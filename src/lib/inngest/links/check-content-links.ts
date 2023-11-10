import inngest from '@/lib/inngest/client'
import { chunkedEntryIds } from '@/lib/contentful'

export default inngest.createFunction(
  {
    id: 'links-check-content-links',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'links/check.content-links',
  },
  async ({ step }) => {
    const links = chunkedEntryIds('contentLink', 100)

    const chunks = await step.run('Get total chunks', links.totalChunks)

    for (let i = 0; i < chunks; i++) {
      const ids = await step.run('Get chunked links', () => links.getChunk(i))
      await step.sendEvent('Dispatch check content links batch event', {
        name: 'links/check.content-links-batch',
        data: {
          ids,
        },
      })
    }

    return {
      done: true,
      dispatched: chunks,
    }
  }
)
