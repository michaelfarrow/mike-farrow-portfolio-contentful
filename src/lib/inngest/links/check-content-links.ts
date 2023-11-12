import inngest from '@/lib/inngest/client'

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
    step.sendEvent('Dispatch batch id event', {
      name: 'general/batch.ids',
      data: {
        type: 'contentLink',
        chunk: 250,
        dispatch: {
          event: 'links/check.content-links-batch',
        },
      },
    })

    return {
      done: true,
    }
  }
)
