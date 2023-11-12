import { chunk } from 'lodash'

import inngest from '@/lib/inngest/client'
import { getEntries } from '@/lib/contentful'

export default inngest.createFunction(
  {
    id: 'general-batch-ids',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'general/batch.ids',
  },
  async ({
    step,
    event: {
      data: { type, chunk: chunkLength, dispatch },
    },
  }) => {
    const allIds = await step.run('Get all ids', async () =>
      (
        await getEntries({ content_type: type, order: 'sys.createdAt' })
      ).map((entry) => entry.sys.id)
    )

    const chunkedIds = chunk(allIds, chunkLength)

    for (const ids of chunkedIds) {
      await step.sendEvent('Dispatch next function', {
        name: dispatch.event,
        data: {
          ids,
          ...('data' in dispatch ? dispatch.data : {}),
        } as any,
      })
    }

    return {
      done: true,
      dispatched: chunkedIds.length,
    }
  }
)
