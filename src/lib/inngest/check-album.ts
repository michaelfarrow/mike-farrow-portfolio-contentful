import inngest from '@/lib/inngest/client'

import { getEntries, getEntry } from '@/lib/contentful'

export type PhotosCheckAlbum = {
  data: {
    id: string
  }
}

export default inngest.createFunction(
  {
    id: 'photos-check-album',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'photos/check.album' },
  async ({ step, event }) => {
    const assetIds = await step.run('fetch-album-asset-ids', async () => {
      const album = await getEntry({
        content_type: 'photoAlbum',
        'sys.id': event.data.id,
      })
      if (!album) return []
      return album.fields.photos?.map((photo) => photo.sys.id) || []
    })

    for (const photo of assetIds) {
      await step.sendEvent('send-photos-check-photo-event', {
        name: 'photos/check.photo',
        data: { id: photo },
      })
    }

    return {
      done: true,
    }
  }
)
