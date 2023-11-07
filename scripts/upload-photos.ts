require('dotenv').config()

import { getEntries } from '@/lib/contentful'
import { getRemoteExifData } from '@/lib/photo'

async function run() {
  const albums = await getEntries({
    content_type: 'photoAlbum',
    order: '-fields.date',
  })

  for (const album of albums) {
    const { photos = [] } = album.fields

    for (const photo of photos) {
      const data = await getRemoteExifData(photo.fields.file.url)
      console.log(data.tags)
    }
  }
}

run()
