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
