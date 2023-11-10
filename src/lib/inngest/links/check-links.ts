import inngest from '@/lib/inngest/client'
import { Document, Block, Inline, Text } from '@contentful/rich-text-types'

export default inngest.createFunction(
  {
    id: 'links-check-links',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'links/check.links',
  },
  async ({ step }) => {
    await step.run('Run', () => true)

    await step.sendEvent('Dispatch check project content links', {
      name: 'links/check.entry-links',
      data: {
        type: 'project',
      },
    })

    await step.sendEvent('Dispatch check content links', {
      name: 'links/check.content-links',
    })

    return {
      done: true,
    }
  }
)
