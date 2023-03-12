import React from 'react'
import { InferGetStaticPropsType } from 'next'

import { getEntries } from '@/lib/contentful'
import EntryLink from '@/components/general/entry-link'
// import AssetImage from '@/components/content/asset-image'

export const getStaticProps = async () => {
  const entries = await getEntries({
    content_type: 'project',
    order: '-fields.date',
    include: 2,
  })

  return {
    props: {
      projects: entries,
    },
  }
}

export default function Index({ projects }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ul>
      {projects.map((project, i) => {
        const {
          fields: { name, thumbnail },
        } = project

        return (
          <li key={i}>
            {/* <AssetImage
              asset={thumbnail}
              width={1000}
              height={1000}
              fit="fill"
              // style={{ paddingTop: '56%' }}
            /> */}
            <EntryLink entry={project}>{name}</EntryLink>
          </li>
        )
      })}
    </ul>
  )
}
