import inngest from '@/lib/inngest/client'

export default inngest.createFunction(
  {
    id: 'cron-check-cameraworld',
    concurrency: {
      limit: 1,
    },
  },
  {
    cron: 'TZ=Europe/London 0 13 * * *',
  },
  async ({ step }) => {
    await step.sendEvent('Dispatch check cameraworld event', {
      name: 'track/check.cameraworld',
    })

    return {
      done: true,
    }
  }
)
