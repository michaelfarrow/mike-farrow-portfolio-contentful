import { CONTENT_TYPE, IEntry } from '@t/contentful'
import { Asset, AssetCollection, createClient } from 'contentful'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import Queue from 'p-queue'
import { tag } from '@/lib/cache'

const queue = new Queue({ concurrency: 1 })

const DEBUG_CACHE = false
let DRAFT_MODE = false

try {
  DRAFT_MODE = draftMode().isEnabled
} catch (e) {
  DRAFT_MODE = false
}

export const PREVIEW = Boolean(
  (process.env.NODE_ENV === 'development' && process.env.CONTENTFUL_PREVIEW_TOKEN) ||
    (process.env.NODE_ENV === 'production' && DRAFT_MODE)
)

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ACCESS_TOKEN =
  (PREVIEW && process.env.CONTENTFUL_PREVIEW_TOKEN) || process.env.CONTENTFUL_ACCESS_TOKEN

if (!SPACE_ID) throw new Error('Contentful space id must be specified')
if (!ACCESS_TOKEN) throw new Error('Contentful access token must be specified')

const contentfulClient = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  host: PREVIEW ? 'preview.contentful.com' : undefined,
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
  return { revalidate: 5 }
  return { tags }
}

const maybeCache: typeof unstable_cache = (cb, ...rest) => {
  if (DRAFT_MODE || !DEBUG_CACHE) return cb
  return unstable_cache(cb, ...rest)
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

export async function getEntriesPage<T extends IEntry>({
  query,
  single,
  page = 1,
  entries = [],
  perPage = PER_PAGE,
}: GetEntriesPageParams<T>): Promise<T[]> {
  DEBUG_CACHE && console.log('fetch', query)
  return await contentfulClient
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
  query: Query<T>,
  tags: string[] = []
) {
  const _query = { order: 'sys.createdAt', ...query }
  const type = query.content_type
  return (
    (await queue.add(() =>
      maybeCache(
        () => getEntriesPage<C>({ query: _query }),
        ['entries', JSON.stringify(_query)],
        cacheConfig(['entries', tag('entries', { type }), ...tags])
      )()
    )) || []
  )
}

export async function getEntry<T extends CONTENT_TYPE, C extends IEntry = ContentType<T>>(
  query: Query<T>,
  tags: string[] = []
) {
  const type = query.content_type
  const slug = query['fields.slug']
  const entries = await queue.add(() =>
    maybeCache(
      () => getEntriesPage<C>({ query, single: true }),
      ['entry', JSON.stringify(query)],
      cacheConfig(['entry', tag('entry', { type }), tag('entry', { type, slug }), ...tags])
    )()
  )
  return (entries && entries.length && entries[0]) || null
}

export const getAsset: typeof contentfulClient.getAsset = (...args) => {
  const [id] = args

  return queue.add(() =>
    maybeCache(
      () => contentfulClient.getAsset(...args),
      ['asset', JSON.stringify(args)],
      cacheConfig(['asset', tag('asset', { id })])
    )()
  ) as Promise<Asset>
}

export const getAssets: typeof contentfulClient.getAssets = (...args) => {
  return queue.add(() =>
    maybeCache(
      () => contentfulClient.getAssets(...args),
      ['assets', JSON.stringify(args)],
      cacheConfig(['assets'])
    )()
  ) as Promise<AssetCollection>
}
