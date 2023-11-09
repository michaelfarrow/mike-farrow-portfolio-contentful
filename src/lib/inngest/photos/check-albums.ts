import inngest from '@/lib/inngest/client'

import { getEntries } from '@/lib/contentful'

export default inngest.createFunction(
  {
    id: 'photos-check-albums',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'photos/check.albums' },
  async ({ step }) => {
    const albumIds = await step.run('Fetch album IDs', async () => {
      const albums = await getEntries({
        content_type: 'photoAlbum',
      })
      return albums.map((album) => album.sys.id)
    })

    for (const album of albumIds) {
      await step.sendEvent('Dispatch check album event', {
        name: 'photos/check.album',
        data: { id: album },
      })
    }

    return {
      done: true,
      dispatched: albumIds.length,
    }
  }
)
