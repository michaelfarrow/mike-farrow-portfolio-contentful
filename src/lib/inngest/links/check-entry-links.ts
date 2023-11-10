import inngest, { CHUNK_DEFAULT } from '@/lib/inngest/client'
import { chunkedEntryIds } from '@/lib/contentful'

export default inngest.createFunction(
  {
    id: 'links-check-entry-links',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'links/check.entry-links',
  },
  async ({
    step,
    event: {
      data: { type },
    },
  }) => {
    const entries = chunkedEntryIds(type, CHUNK_DEFAULT)

    const chunks = await step.run('Get total chunks', entries.totalChunks)

    for (let i = 0; i < chunks; i++) {
      const ids = await step.run('Get chunked entries', () => entries.getChunk(i))
      await step.sendEvent('Dispatch check entry links batch event', {
        name: 'links/check.entry-links-batch',
        data: {
          type,
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
