import clsx from 'clsx'

import getData from './data'

import initSettings from '@/lib/settings'

import Experience from '@/components/cv/experience'
import Education from '@/components/cv/education'
import Skills from '@/components/cv/skills'

import typography from '@/styles/typography.module.css'

export interface Props extends Awaited<ReturnType<typeof getData>> {}

export default function CvPage({ settings, experience, education, skills }: Props) {
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
