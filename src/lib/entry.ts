import { CONTENT_TYPE, IEntry } from '@t/contentful'
import { ContentType } from '@/lib/contentful'

export type LinkType<T extends CONTENT_TYPE> = {
  path?: string
  key: keyof ContentType<T>['fields']
}

export type UrlConfig = {
  [key in CONTENT_TYPE]?: LinkType<key>
}

const urlConfig: UrlConfig = {
  project: {
    path: 'projects',
    key: 'slug',
  },
  photoAlbum: {
    path: 'albums',
    key: 'slug',
  },
}

function entryConfig(type: CONTENT_TYPE) {
  return urlConfig[type] || null
}

function entryPath(config: LinkType<any>, slug: string) {
  const path = (config.path && `${config.path}/`) || ''
  return `/${path}${encodeURIComponent(slug)}`
}

export function urlForEntrySlug(type: CONTENT_TYPE, slug: string) {
  const config = entryConfig(type)
  if (!config) return null

  return entryPath(config, slug)
}

export function urlForEntry(entry: IEntry) {
  const config = entryConfig(entry.sys.contentType.sys.id)
  if (!config) return null

  return entryPath(config, (entry.fields as any)[config.key])
}
