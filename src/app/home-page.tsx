import clsx from 'clsx'

import getData from './data'

import initSettings from '@/lib/settings'
import typography from '@/styles/typography.module.css'

export interface Props extends Awaited<ReturnType<typeof getData>> {}

export default function HomePage({ settings }: Props) {
  const s = initSettings(settings)
  const blurb = s.text('blurb')

  return (
    <>
      {(blurb && <p className={clsx(typography.large, typography.highlight)}>{blurb}</p>) || null}
    </>
  )
}
