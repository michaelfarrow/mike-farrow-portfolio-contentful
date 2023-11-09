import { EventSchemas, Inngest } from 'inngest'

type Data<T extends object> = {
  data: T
}

type Id<T extends object = {}> = Data<{ id: string } & T>

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
  'links/check.link': Data<{
    type: string
    name: string
    url: string
  }>
}

const inngest = new Inngest({ id: 'mf', schemas: new EventSchemas().fromRecord<Events>() })

export default inngest
