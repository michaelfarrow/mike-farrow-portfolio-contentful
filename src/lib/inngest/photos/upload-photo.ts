import inngest from '@/lib/inngest/client'
import axios from 'axios'

export default inngest.createFunction(
  {
    id: 'photos-upload-photo',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'photos/upload.photo' },
  async ({ step, event }) => {
    await step.run('Ensure image is generated', () =>
      axios.get(event.data.url.instagram).then(() => true)
    )

    return {
      done: true,
    }
  }
)
