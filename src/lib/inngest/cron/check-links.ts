import inngest from '@/lib/inngest/client'

export default inngest.createFunction(
  {
    id: 'cron-check-links',
    concurrency: {
      limit: 1,
    },
  },
  {
    cron: 'TZ=Europe/London 0 16 * * 3',
  },
  async ({ step }) => {
    await step.sendEvent('Dispatch check links event', {
      name: 'links/check.links',
    })

    return {
      done: true,
    }
  }
)
