import inngest from '@/lib/inngest/client'

import { revalidateTag } from 'next/cache'

export const runtime = 'edge'

export default inngest.createFunction(
  {
    id: 'cache-revalidate-tag',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'cache/revalidate.tag',
  },
  async ({
    step,
    event: {
      data: { tag },
    },
  }) => {
    await step.run('Revalidate tag', async () => {
      await revalidateTag(tag)
      return new Promise((resolve) => {
        setTimeout(resolve, 5 * 1000)
      })
    })

    return { ok: true }
  }
)
