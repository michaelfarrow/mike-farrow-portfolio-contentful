import { EventSchemas, Inngest } from 'inngest'

import { PhotosCheckAlbums } from './check-albums'
import { PhotosCheckAlbum } from './check-album'
import { PhotosCheckPhoto } from './check-photo'
import { PhotosUploadPhoto } from './upload-photo'
import { LinksCheckLinks } from './check-links'

type Events = {
  'photos/check.albums': PhotosCheckAlbums
  'photos/check.album': PhotosCheckAlbum
  'photos/check.photo': PhotosCheckPhoto
  'photos/upload.photo': PhotosUploadPhoto
  'links/check.links': LinksCheckLinks
}

const inngest = new Inngest({ id: 'mf', schemas: new EventSchemas().fromRecord<Events>() })

export default inngest
