import { CONTENT_TYPE, IEntry } from '@t/contentful'
import { createClient, Entry } from 'contentful'

const PREVIEW = process.env.NODE_ENV === 'development' && process.env.CONTENTFUL_PREVIEW_TOKEN

const LIVE_PREVIEW =
  process.env.NODE_ENV === 'production' &&
  !process.env.NETLIFY &&
  process.env.CONTENTFUL_PREVIEW_TOKEN

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
  page?: number
  entries?: T[]
}

type Query<T extends CONTENT_TYPE> = {
  content_type: T
  include?: number
  [key: string]: any
}

type ContentType<P extends CONTENT_TYPE, T = IEntry> = T extends Entry<any> & {
  sys: { contentType: { sys: { id: P } } }
}
  ? T
  : never

function getEntriesPage<T extends Entry<any>>({
  query,
  single = false,
  page = 1,
  entries = [],
}: GetEntriesPageParams<T>): Promise<T[]> {
  return contentfulClient
    .getEntries<T>({
      ...query,
      limit: single ? 1 : PER_PAGE,
      skip: PER_PAGE * (page - 1),
    })
    .then((res) => {
      if (res.items && res.items.length) {
        entries = entries.concat(res.items as T[])
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

export function getEntries<T extends CONTENT_TYPE, C extends Entry<any> = ContentType<T>>(
  query: Query<T>
): Promise<C[]> {
  return getEntriesPage<C>({ query: { order: 'sys.createdAt', ...query } })
}

export async function getEntry<T extends CONTENT_TYPE, C extends Entry<any> = ContentType<T>>(
  query: Query<T>
): Promise<C | null> {
  const entries = await getEntriesPage<C>({ query, single: true })
  return (entries.length && entries[0]) || null
}
