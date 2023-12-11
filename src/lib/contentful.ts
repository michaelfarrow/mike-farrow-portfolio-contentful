import { URL } from 'url'
import { CONTENT_TYPE, IEntry } from '@t/contentful'
import { Asset, createClient } from 'contentful'
import { draftMode } from 'next/headers'
import pThrottle from 'p-throttle'
import { tag } from '@/lib/cache'

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
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT
const ACCESS_TOKEN =
  (PREVIEW && process.env.CONTENTFUL_PREVIEW_TOKEN) || process.env.CONTENTFUL_ACCESS_TOKEN
const HOST = PREVIEW ? 'preview.contentful.com' : 'cdn.contentful.com'
const RATE_LIMIT = PREVIEW ? 14 : 55

if (!SPACE_ID) throw new Error('Contentful space id must be specified')
if (!ACCESS_TOKEN) throw new Error('Contentful access token must be specified')

const PER_PAGE = 100
const BASE_URL = `https://${HOST}/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`

const throttle = pThrottle({
  limit: RATE_LIMIT,
  interval: 1000,
})

const contentful = createClient({
  accessToken: ACCESS_TOKEN,
  space: SPACE_ID,
  environment: ENVIRONMENT,
  host: HOST,
})

type GetEntriesPageParams<T> = {
  query: any
  single?: boolean
  singlePage?: boolean
  page?: number
  entries?: T[]
  perPage?: number
  tags?: string[]
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

const apiRequest = throttle((endpoint: string, query: any = {}, tags?: string[]) => {
  console.log('apiRequest', endpoint, query, tags)
  const url = new URL(`${BASE_URL}/${endpoint}`)
  url.search = new URLSearchParams({ access_token: ACCESS_TOKEN || '', ...query }).toString()
  return fetch(url.toString(), {
    cache: PREVIEW ? 'no-cache' : undefined,
    next: {
      tags: PREVIEW ? undefined : tags,
    },
  })
})

async function getEntriesPage<T extends IEntry>({
  query,
  single,
  page = 1,
  entries = [],
  perPage = PER_PAGE,
  tags = [],
}: GetEntriesPageParams<T>) {
  const res = await apiRequest(
    'entries',
    {
      ...query,
      limit: single ? 1 : perPage,
      skip: perPage * (page - 1),
    },
    tags
  )
  const data = await contentful.parseEntries<T>(await res.json())

  if (data.items && data.items.length) {
    entries = entries.concat(data.items as unknown as T[])
    if (single || data.total == data.skip + data.items.length) return entries

    return getEntriesPage({
      query,
      single,
      page: page + 1,
      entries,
    })
  } else {
    return entries
  }

  // if (e.details && e.details.errors && e.details.errors.length) console.error(e.details.errors)
  // throw e
}

export async function getEntries<T extends CONTENT_TYPE, C extends IEntry = ContentType<T>>(
  query: Query<T>,
  tags: string[] = []
) {
  const _query = { order: 'sys.createdAt', ...query }
  const type = query.content_type

  return getEntriesPage<C>({
    query: _query,
    tags: ['entries', tag('entries', { type }), ...tags],
  })
}

export async function getEntry<T extends CONTENT_TYPE, C extends IEntry = ContentType<T>>(
  query: Query<T>,
  tags: string[] = []
) {
  const type = query.content_type
  const slug = query['fields.slug']
  const entries = await getEntriesPage<C>({
    query,
    single: true,
    tags: ['entry', tag('entry', { type }), tag('entry', { type, slug }), ...tags],
  })

  return (entries && entries.length && entries[0]) || null
}

export const getAssets: typeof contentful.getAssets = async (query) => {
  const res = await apiRequest('assets', query, ['assets'])
  return await res.json()
}

export const getAsset = async (...[id, query]: Parameters<typeof contentful.getAsset>) => {
  const res = await apiRequest(`assets/${id}`, query, ['asset', tag('asset', { id })])
  const data = await res.json()
  if (data?.sys?.type === 'Error') return null
  return data as Asset
}
