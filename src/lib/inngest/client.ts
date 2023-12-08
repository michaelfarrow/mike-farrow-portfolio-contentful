import { EventSchemas, Inngest } from 'inngest'

import { CONTENT_TYPE } from '@t/contentful'

type Data<T extends object> = {
  data: T
}

type Id<T extends object = {}> = Data<{ id: string } & T>

type EntryWithContent = Extract<CONTENT_TYPE, 'project'>

type SupportBatch = {
  [key in keyof Events as Events[key] extends Data<{ ids: string[] }> ? key : never]: Events[key]
}

type BatchDispatchEvent<
  T extends keyof SupportBatch,
  D = Omit<SupportBatch[T]['data'], 'ids'>
> = keyof D extends never
  ? {
      event: T
    }
  : { event: T; data: D }

type BatchDispatch = {
  [key in keyof SupportBatch]: BatchDispatchEvent<key>
}[keyof SupportBatch]

type Events = {
  'general/batch.ids': Data<{
    type: CONTENT_TYPE
    chunk: number
    dispatch: BatchDispatch
  }>
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
  'products/check.cameraworld': {}
  'products/check.cameraworld-product': Id<{
    target?: number
  }>
}

const schemas = new EventSchemas().fromRecord<Events>()

const inngest = new Inngest({ id: 'mf', schemas })

export default inngest
