import { serve } from 'inngest/next'

import inngest from '@/lib/inngest/client'

import checkLinks from '@/lib/inngest/links/check-links'
import checkLink from '@/lib/inngest/links/check-link'

import checkAlbums from '@/lib/inngest/photos/check-albums'
import checkAlbum from '@/lib/inngest/photos/check-album'
import checkPhoto from '@/lib/inngest/photos/check-photo'
import uploadPhoto from '@/lib/inngest/photos/upload-photo'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkLinks, checkLink, checkAlbums, checkAlbum, checkPhoto, uploadPhoto],
})
