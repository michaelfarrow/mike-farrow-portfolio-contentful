import { serve } from 'inngest/next'

import inngest from '@/lib/inngest/client'
import checkLinks from '@/lib/inngest/check-links'
import uploadPhotos from '@/lib/inngest/upload-photos'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkLinks, uploadPhotos],
})
