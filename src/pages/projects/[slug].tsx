import React from 'react'
import clsx from 'clsx'

import { IProject } from '@t/contentful'
import {
  ParsedUrlQuery,
  GetStaticPaths,
  GetStaticPropsNonNullable,
  InferGetStaticPropsType,
} from '@/lib/page'
import { getEntries, getEntry } from '@/lib/contentful'
import RichText from '@/components/general/rich-text'
import Attributions from '@/components/project/attributions'
import Picture from '@/components/general/picture'
import Video from '@/components/content/video'
import Image from '@/components/content/image'
import typography from '@/styles/typography.module.css'

export interface Params extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const entries = await getEntries({
    content_type: 'project',
  })
  return {
    paths: entries.map((work) => ({
      params: { slug: work.fields.slug },
    })),
    fallback: 'blocking',
  }
}

const getData = async (params?: Params) => {
  const entry = await getEntry({
    content_type: 'project',
    include: 4,
    'fields.slug': params?.slug,
  })
  return {
    project: entry,
  }
}

export const getStaticProps: GetStaticPropsNonNullable<typeof getData, Params> = async ({
  params,
}) => {
  const { project } = await getData(params)
  return project
    ? {
        props: {
          project,
        },
      }
    : { notFound: true }
}

export function Project({ entry }: { entry: IProject }) {
  return <div>Project: {entry.fields.name}</div>
}

export default function Index({
  project: {
    fields: { name, content, attributions },
  },
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <h2 className={clsx(typography.h, typography.h2)}>{name}</h2>

      <div className={typography.textLinks}>
        <RichText
          blockEmbeddedEntry={{
            contentVideo: Video,
            contentImage: Image,
            project: Project,
          }}
          blockEmbeddedAsset={(asset, type) => {
            if (type.startsWith('image/')) {
              return <Picture alt={asset.fields.title} images={[{ image: asset }]} />
            }
          }}
          // blockProps={{ paragraph: { className: typography.textLinks } }}
        >
          {content}
        </RichText>
      </div>
      {attributions?.length ? <Attributions entries={attributions} /> : null}
    </>
  )
}
