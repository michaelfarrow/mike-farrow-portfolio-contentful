import inngest from '@/lib/inngest/client'

import { getAsset } from '@/lib/contentful'
import { getRemoteExifData, normaliseExifData, imageAssetProps } from '@/lib/image'
import { Asset } from 'contentful'

export default inngest.createFunction(
  {
    id: 'photos-check-photo',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'photos/check.photo' },
  async ({ step, event }) => {
    const photo = await step.run(
      'Get photo asset data',
      async () => (await getAsset(event.data.id)).fields
    )

    if (photo) {
      const exifInfo = await step.run(
        'Get photo EXIF data',
        async () => normaliseExifData(await getRemoteExifData(photo.file.url)).processed
      )

      const {
        title,
        description,
        file: {
          url,
          details: { image: { width, height } = {} },
        },
      } = photo

      const { camera, lens, settings } = exifInfo
      const _settings = Object.values(settings).filter((v) => !!v)

      const instagram = imageAssetProps({
        asset: { fields: photo } as Asset,
        format: 'jpg',
        [width && height && width > height ? 'height' : 'width']: 1350,
        quality: 100,
      })

      await step.sendEvent('Send photos upload photo event', {
        name: 'photos/upload.photo',
        data: {
          title,
          description: (description.length && description) || undefined,
          info: [camera, lens, (_settings.length && _settings.join(' ')) || undefined].filter(
            (v?: string): v is string => {
              return !!v
            }
          ),
          url: {
            original: url,
            instagram: instagram.src,
          },
        },
      })
    }

    return {
      done: true,
      dispatched: true,
    }
  }
)
