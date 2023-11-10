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
  async ({
    step,
    event: {
      data: { url },
    },
  }) => {
    await step.run('Ensure image is generated', () => axios.get(url.instagram).then(() => true))

    return {
      done: true,
    }
  }
)
