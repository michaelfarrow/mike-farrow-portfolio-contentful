import { GetStaticProps as NextGetStaticProps, InferGetStaticPropsType, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { NonNullableObject } from '@/lib/types'

export type { GetStaticPaths, InferGetStaticPropsType } from 'next'
export type { ParsedUrlQuery } from 'querystring'

export type GetStaticProps<
  GetData extends (params: Params) => PromiseLike<{ [key: string]: any }>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = NextGetStaticProps<Awaited<ReturnType<GetData>>, Params, Preview>

export type GetStaticPropsNonNullable<
  GetData extends (params: Params) => PromiseLike<{ [key: string]: any }>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  K extends keyof Awaited<ReturnType<GetData>> = keyof Awaited<ReturnType<GetData>>,
  Preview extends PreviewData = PreviewData
> = NextGetStaticProps<NonNullableObject<Awaited<ReturnType<GetData>>, K>, Params, Preview>

export function Handle404<T extends React.ComponentType<any>>(Component: T) {
  const ComponentWith404 = (props: any) => {
    if (!props || !Object.keys(props).length) {
      return null
    }
    return <Component {...props} />
  }
  ComponentWith404.displayName = `${Component.displayName}With404`
  return ComponentWith404
}
