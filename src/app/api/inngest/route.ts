import { serve } from 'inngest/next'

import inngest from '@/lib/inngest/client'
import checkLinks from '@/lib/inngest/check-links'
import checkAlbums from '@/lib/inngest/check-albums'
import checkAlbum from '@/lib/inngest/check-album'
import checkPhoto from '@/lib/inngest/check-photo'
import uploadPhoto from '@/lib/inngest/upload-photo'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkLinks, checkAlbums, checkAlbum, checkPhoto, uploadPhoto],
})
