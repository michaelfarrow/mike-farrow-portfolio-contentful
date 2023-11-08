require('dotenv').config()

import { getEntries } from '@/lib/contentful'
import { getAssetExifData } from '@/lib/image'

async function run() {
  const albums = await getEntries({
    content_type: 'photoAlbum',
    order: '-fields.date',
  })

  for (const album of albums) {
    const { photos = [] } = album.fields

    for (const photo of photos) {
      const data = await getAssetExifData(photo)
      console.log(data)
    }
  }
}

run()
