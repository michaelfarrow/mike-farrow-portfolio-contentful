import inngest from '@/lib/inngest/client'

export type PhotosUploadPhoto = {
  data: {
    title: string
    description: string
    url: string
  }
}

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
