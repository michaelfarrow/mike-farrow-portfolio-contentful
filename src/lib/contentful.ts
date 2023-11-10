import { CONTENT_TYPE, IEntry } from '@t/contentful'
import { createClient } from 'contentful'

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
  singlePage,
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
        if (single || singlePage || res.total == res.skip + res.items.length) return entries
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

export function getEntries<T extends CONTENT_TYPE, C extends IEntry = ContentType<T>>(
  query: Query<T>
): Promise<C[]> {
  return getEntriesPage<C>({ query: { order: 'sys.createdAt', ...query } })
}

export async function getEntry<T extends CONTENT_TYPE, C extends IEntry = ContentType<T>>(
  query: Query<T>
): Promise<C | null> {
  const entries = await getEntriesPage<C>({ query, single: true })
  return (entries.length && entries[0]) || null
}

export function chunkedEntryIds<T extends CONTENT_TYPE>(type: T, chunk: number) {
  const query = { content_type: type, order: 'sys.createdAt' }

  return {
    totalChunks: async () => Math.ceil((await getEntries(query)).length / chunk),
    getChunk: async (i: number) =>
      (await getEntriesPage({ query, singlePage: true, page: i + 1, perPage: chunk })).map(
        (entry) => entry.sys.id
      ),
  }
}

export const getAsset = contentfulClient.getAsset
export const getAssets = contentfulClient.getAssets
