import clsx from 'clsx'

import { getEntries } from '@/lib/contentful'
import initSettings, { getSettings } from '@/lib/settings'

import Experience from '@/components/cv/experience'
import Education from '@/components/cv/education'
import Skills from '@/components/cv/skills'

import typography from '@/styles/typography.module.scss'

export default async function Page() {
  const settings = await getSettings('cv')

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

  const s = initSettings(settings)
  const blurb = s.text('cv.blurb')

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
