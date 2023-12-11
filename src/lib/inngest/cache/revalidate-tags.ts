import inngest from '@/lib/inngest/client'

export default inngest.createFunction(
  {
    id: 'cache-revalidate-tags',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'cache/revalidate.tags',
  },
  async ({
    step,
    event: {
      data: { tags },
    },
  }) => {
    await step.run('Run', () => true)

    for (const tag of tags) {
      await step.sendEvent('Dispatch revalidate tag event', {
        name: 'cache/revalidate.tag',
        data: { tag },
      })
    }

    return { ok: true, dispatched: tags.length }
  }
)
