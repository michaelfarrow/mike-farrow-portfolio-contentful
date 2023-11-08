import inngest from '@/lib/inngest/client'

import { getEntries, getEntry } from '@/lib/contentful'

export default inngest.createFunction(
  { id: 'upload-photos' },
  { event: 'upload' },
  async ({ step }) => {
    const albumIds = await step.run('fetch-album-ids', async () => {
      const albums = await getEntries({
        content_type: 'photoAlbum',
      })
      return albums.map((album) => album.sys.id)
    })

    for (const albumId of albumIds) {
      const albumInfo = await step.run('fetch-album-asset-ids', async () => {
        const album = await getEntry({
          content_type: 'photoAlbum',
          'sys.id': albumId,
        })

        if (!album) return { album: albumId, assets: [] }

        return { album: albumId, assets: album.fields.photos?.map((photo) => photo.sys.id) || [] }
      })
    }

    return {
      done: true,
    }
  }
)
