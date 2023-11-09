import inngest from '@/lib/inngest/client'

export default inngest.createFunction(
  {
    id: 'photos-upload-photo',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'photos/upload.photo' },
  async ({ step, event }) => {
    console.log(event.data)

    return {
      done: true,
    }
  }
)
