import { EventSchemas, Inngest } from 'inngest'

import { CONTENT_TYPE } from '@t/contentful'

export const CHUNK_DEFAULT = 5

type Data<T extends object> = {
  data: T
}

type Id<T extends object = {}> = Data<{ id: string } & T>

type EntryWithContent = Extract<CONTENT_TYPE, 'project'>

type Events = {
  'photos/check.albums': {}
  'photos/check.album': Id
  'photos/check.photo': Id
  'photos/upload.photo': Data<{
    title: string
    description?: string
    info: string[]
    url: {
      original: string
      instagram: string
    }
  }>
  'links/check.links': {}
  'links/check.entry-links': Data<{
    type: EntryWithContent
  }>
  'links/check.entry-links-batch': Data<{
    type: EntryWithContent
    ids: string[]
  }>
  'links/check.content-links': {}
  'links/check.content-links-batch': Data<{
    ids: string[]
  }>
  'links/check.link': Data<{
    type: string
    name: string
    url: string
    edit: string
  }>
}

const inngest = new Inngest({ id: 'mf', schemas: new EventSchemas().fromRecord<Events>() })

export default inngest
