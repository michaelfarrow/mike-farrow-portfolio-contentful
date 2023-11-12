import inngest from '@/lib/inngest/client'

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
    step.sendEvent('Dispatch batch id event', {
      name: 'general/batch.ids',
      data: {
        type: type,
        chunk: 5,
        dispatch: {
          event: 'links/check.entry-links-batch',
          data: { type },
        },
      },
    })

    return {
      done: true,
    }
  }
)
