import { serve } from 'inngest/next'

import inngest from '@/lib/inngest/client'

import cronCheckLinks from '@/lib/inngest/cron/check-links'

import linksCheckLinks from '@/lib/inngest/links/check-links'
import linksCheckLink from '@/lib/inngest/links/check-link'

import photosCheckAlbums from '@/lib/inngest/photos/check-albums'
import photosCheckAlbum from '@/lib/inngest/photos/check-album'
import photosCheckPhoto from '@/lib/inngest/photos/check-photo'
import photosUploadPhoto from '@/lib/inngest/photos/upload-photo'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    cronCheckLinks,

    linksCheckLinks,
    linksCheckLink,

    photosCheckAlbums,
    photosCheckAlbum,
    photosCheckPhoto,
    photosUploadPhoto,
  ],
})
