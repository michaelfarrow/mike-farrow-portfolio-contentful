import React from 'react'

import { GetStaticProps, InferGetStaticPropsType } from '@/lib/page'
import { getEntry } from '@/lib/contentful'
import initSettings from '@/lib/settings'

const getData = async () => {
  const settings = await getEntry({
    content_type: 'settings',
    'fields.key': 'home',
  })

  return {
    settings,
  }
}

export const getStaticProps: GetStaticProps<typeof getData> = async () => {
  return {
    props: await getData(),
  }
}

export default function Index({ settings }: InferGetStaticPropsType<typeof getStaticProps>) {
  const s = initSettings(settings)
  const blurb = s.text('blurb')

  return (
    <>
      <h1>Mike Farrow</h1>
      {(blurb && <p>{blurb}</p>) || null}
    </>
  )
}
