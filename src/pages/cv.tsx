import React from 'react'
import clsx from 'clsx'

import { GetStaticProps, InferGetStaticPropsType } from '@/lib/page'
import { getEntries, getEntry } from '@/lib/contentful'
import initSettings from '@/lib/settings'

import Experience from '@/components/cv/experience'
import Education from '@/components/cv/education'
import Skills from '@/components/cv/skills'

import typography from '@/styles/typography.module.css'

const getData = async () => {
  const settings = await getEntry({
    content_type: 'settings',
    'fields.key': 'cv',
  })

  const experience = await getEntries({
    content_type: 'cvExperience',
    order: '-fields.from',
    include: 2,
  })

  const education = await getEntries({
    content_type: 'cvEducation',
    order: '-fields.from',
    include: 2,
  })

  const skills = await getEntries({
    content_type: 'cvSkill',
    'fields.root': true,
    order: 'fields.name',
    include: 10,
  })

  return {
    settings,
    experience,
    education,
    skills,
  }
}

export const getStaticProps: GetStaticProps<typeof getData> = async () => {
  return {
    props: await getData(),
  }
}

export default function Index({
  settings,
  experience,
  education,
  skills,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const s = initSettings(settings)
  const blurb = s.text('blurb')

  return (
    <div className={typography.textLinks}>
      {(blurb && <p className={clsx(typography.large, typography.highlight)}>{blurb}</p>) || null}
      <h2 className={typography.h2}>Experience</h2>
      <Experience entries={experience} />
      <h2 className={typography.h2}>Key Skills</h2>
      <Skills entries={skills} />
      <h2 className={typography.h2}>Education</h2>
      <Education entries={education} />
    </div>
  )
}
