import inngest from '@/lib/inngest/client'

import { revalidateTag } from 'next/cache'

async function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

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
    event: {
      data: { tag },
    },
  }) => {
    await revalidateTag(tag)
    await wait(3)

    return { ok: true }
  }
)
