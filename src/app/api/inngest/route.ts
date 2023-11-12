import { serve } from 'inngest/next'

import inngest from '@/lib/inngest/client'

import cronCheckLinks from '@/lib/inngest/cron/check-links'

import generalBatchIds from '@/lib/inngest/general/batch-ids'

import linksCheckEntryLinks from '@/lib/inngest/links/check-entry-links'
import linksCheckEntryLinksBatch from '@/lib/inngest/links/check-entry-links-batch'
import linksCheckContentLinks from '@/lib/inngest/links/check-content-links'
import linksCheckContentLinksBatch from '@/lib/inngest/links/check-content-links-batch'
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

    generalBatchIds,

    linksCheckEntryLinks,
    linksCheckEntryLinksBatch,
    linksCheckContentLinks,
    linksCheckContentLinksBatch,
    linksCheckLinks,
    linksCheckLink,

    photosCheckAlbums,
    photosCheckAlbum,
    photosCheckPhoto,
    photosUploadPhoto,
  ],
})
