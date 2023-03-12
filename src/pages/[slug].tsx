import { Entry } from 'contentful'

import { IPage, IPageCv } from '@t/contentful'

import {
  ParsedUrlQuery,
  GetStaticPaths,
  GetStaticPropsNonNullable,
  InferGetStaticPropsType,
} from '@/lib/page'
import { getEntry } from '@/lib/contentful'
import { fetchCvPageData } from '@/components/pages/cv'

const FETCHERS = [dataFetcher('pageCv', fetchCvPageData)]

type PageContent = NonNullable<IPage['fields']['content']>
type PageType = PageContent['sys']['contentType']['sys']['id']

export interface Params extends ParsedUrlQuery {
  slug?: string
}

type DataFetcher<
  P extends PageType,
  T = NonNullable<IPage['fields']['content']>
> = T extends Entry<any> & {
  sys: { contentType: { sys: { id: P } } }
}
  ? T
  : never

async function fetchData(
  page: PageContent | undefined,
  type: string | undefined,
  fetchers: { type: PageType; fetcher: (page: any) => Promise<any> | any }[]
) {
  const config = fetchers.find((h) => h.type === type)
  if (!config) return {}
  return await config.fetcher(page)
}

function dataFetcher<T extends PageType>(
  type: T,
  fetcher: (page: DataFetcher<T>) => Promise<any> | any
) {
  return { type, fetcher }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const home = await getEntry<IPage>({
    content_type: 'page',
    'fields.slug': '/',
  })
  return {
    paths:
      (home &&
        home.fields.subPages?.map((page) => ({
          params: { slug: page.fields.slug },
        }))) ||
      [],
    fallback: 'blocking',
  }
}

const getData = async (
  params?: Params
): Promise<{
  page: IPage | null
  data: any
}> => {
  const entry = await getEntry<IPage>({
    content_type: 'page',
    include: 4,
    'fields.slug': params?.slug || '/',
  })
  return {
    page: entry,
    data: {},
  }
}

export const getStaticProps: GetStaticPropsNonNullable<typeof getData, Params> = async ({
  params,
}) => {
  const { page } = await getData(params)

  return page
    ? {
        props: {
          page,
          data: await fetchData(
            page.fields.content,
            page.fields.content?.sys.contentType.sys.id,
            FETCHERS
          ),
        },
      }
    : { notFound: true }
}

// type Handler<
//   P extends PageType,
//   T = NonNullable<IPage['fields']['content']>
// > = T extends Entry<any> & {
//   sys: { contentType: { sys: { id: P } } }
// }
//   ? T
//   : never

// function handleAll(
//   page: PageContent,
//   type: string,
//   handlers: { type: PageType; Component: React.ComponentType<{ page: any }> }[]
// ) {
//   const handler = handlers.find((h) => h.type === type)
//   if (!handler) return null
//   return <handler.Component page={page}></handler.Component>
// }

// function handler<T extends PageType>(
//   type: T,
//   Component: React.ComponentType<{ page: Handler<T> }>
// ) {
//   return { type, Component }
// }

export default function Page({
  data,
  page,
  page: {
    fields: { name, content },
  },
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!content) return <div>Unconfigured page</div>

  return (
    <>
      <h1>{name}</h1>
      <div>{JSON.stringify(page)}</div>
      <div>{JSON.stringify(data)}</div>
      {/* {handleAll(content, content.sys.contentType.sys.id, [
        handler('pageCv', PageCV),
        handler('pageProjects', PageProjects),
      ])} */}
    </>
  )
}
