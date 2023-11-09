import inngest from '@/lib/inngest/client'

import { getAsset } from '@/lib/contentful'
import { getAssetExifData } from '@/lib/image'
import { Asset } from 'contentful'

export type PhotosCheckPhoto = {
  data: {
    id: string
  }
}

export default inngest.createFunction(
  {
    id: 'photos-check-photo',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'photos/check.photo' },
  async ({ step, event }) => {
    const photo = await step.run('get-photo', () => getAsset(event.data.id))

    if (photo) {
      const exifInfo = await step.run(
        'get-photo-exif',
        async () => (await getAssetExifData(photo as Asset, true)).processed
      )

      const {
        title,
        description,
        file: { url },
      } = photo.fields

      const { camera, lens, settings } = exifInfo
      const _settings = Object.values(settings).filter((v) => !!v)

      await step.sendEvent('send-photos-upload-photo-event', {
        name: 'photos/upload.photo',
        data: {
          title,
          description: [
            (description.length && description) || null,
            camera,
            lens,
            (_settings.length && _settings.join(' ')) || null,
          ]
            .filter((v) => !!v)
            .join('. '),
          url,
        },
      })
    }

    return {
      done: true,
    }
  }
)
