import { CONTENT_TYPE, IEntry } from '@t/contentful'
import { Asset, AssetCollection, createClient } from 'contentful'
import { unstable_cache } from 'next/cache'
import Queue from 'p-queue'
import { tag } from '@/lib/cache'

const queue = new Queue({ concurrency: 1 })

export const PREVIEW = Boolean(
  process.env.NODE_ENV === 'development' && process.env.CONTENTFUL_PREVIEW_TOKEN
)

export const LIVE_PREVIEW = Boolean(
  process.env.NODE_ENV === 'production' &&
    !process.env.NETLIFY &&
    process.env.CONTENTFUL_PREVIEW_TOKEN
)

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ACCESS_TOKEN =
  ((LIVE_PREVIEW || PREVIEW) && process.env.CONTENTFUL_PREVIEW_TOKEN) ||
  process.env.CONTENTFUL_ACCESS_TOKEN

if (!SPACE_ID) throw new Error('Contentful space id must be specified')
if (!ACCESS_TOKEN) throw new Error('Contentful access token must be specified')

const contentfulClient = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  host: LIVE_PREVIEW || PREVIEW ? 'preview.contentful.com' : undefined,
})

export default contentfulClient

const PER_PAGE = 100

type GetEntriesPageParams<T> = {
  query: any
  single?: boolean
  singlePage?: boolean
  page?: number
  entries?: T[]
  perPage?: number
}

export type Query<T extends CONTENT_TYPE> = {
  content_type: T
  include?: number
  [key: string]: any
}

function cacheConfig(tags: string[]) {
  return process.env.NODE_ENV === 'production' ? { tags } : { revalidate: 1 }
}

export type ContentType<P extends CONTENT_TYPE, T = IEntry> = T extends IEntry & {
  sys: { contentType: { sys: { id: P } } }
}
  ? T
  : never

export function isContentType<T extends CONTENT_TYPE>(
  entry: IEntry,
  type: T
): entry is ContentType<T> {
  return entry.sys.contentType.sys.id === type
}

export function editLink(entry: IEntry) {
  return `https://app.contentful.com/spaces/${SPACE_ID}/entries/${entry.sys.id}`
}

export function getEntriesPage<T extends IEntry>({
  query,
  single,
  page = 1,
  entries = [],
  perPage = PER_PAGE,
}: GetEntriesPageParams<T>): Promise<T[]> {
  return contentfulClient
    .getEntries<T>({
      ...query,
      limit: single ? 1 : perPage,
      skip: perPage * (page - 1),
    })
    .then((res) => {
      if (res.items && res.items.length) {
        entries = entries.concat(res.items as unknown as T[])
        if (single || res.total == res.skip + res.items.length) return entries
        return getEntriesPage({
          query,
          single,
          page: page + 1,
          entries,
        })
      } else {
        return entries
      }
    })
    .catch((e) => {
      if (e.details && e.details.errors && e.details.errors.length) console.error(e.details.errors)
      throw e
    })
}

export async function getEntries<T extends CONTENT_TYPE, C extends IEntry = ContentType<T>>(
  query: Query<T>
) {
  const _query = { order: 'sys.createdAt', ...query }
  return (
    (await queue.add(() =>
      unstable_cache(
        () => getEntriesPage<C>({ query: _query }),
        ['entries', JSON.stringify(_query)],
        cacheConfig(['entries', `entries,type:${_query.content_type}`])
      )()
    )) || []
  )
}

export async function getEntry<T extends CONTENT_TYPE, C extends IEntry = ContentType<T>>(
  query: Query<T>
) {
  const type = query.content_type
  const entries = await queue.add(() =>
    unstable_cache(
      () => getEntriesPage<C>({ query, single: true }),
      ['entry', JSON.stringify(query)],
      cacheConfig([
        'entry',
        tag('entry', { type }),
        tag('entry', { type, slug: query['fields.slug'] }),
      ])
    )()
  )
  return (entries && entries.length && entries[0]) || null
}

export const getAsset: typeof contentfulClient.getAsset = (...args) => {
  const [id] = args
  return queue.add(() =>
    unstable_cache(
      () => contentfulClient.getAsset(...args),
      ['asset', JSON.stringify(args)],
      cacheConfig(['asset', tag('asset', { id })])
    )()
  ) as Promise<Asset>
}

export const getAssets: typeof contentfulClient.getAssets = (...args) => {
  return queue.add(() =>
    unstable_cache(
      () => contentfulClient.getAssets(...args),
      ['assets', JSON.stringify(args)],
      cacheConfig(['assets'])
    )()
  ) as Promise<AssetCollection>
}
