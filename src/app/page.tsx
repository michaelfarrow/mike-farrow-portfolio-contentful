import clsx from 'clsx'

import initSettings, { getSettings } from '@/lib/settings'
import typography from '@/styles/typography.module.scss'

export default async function Page() {
  const settings = await getSettings('home')

  const s = initSettings(settings)
  const blurb = s.text('home.blurb')

  return (
    <>
      {(blurb && <p className={clsx(typography.large, typography.highlight)}>{blurb}</p>) || null}
    </>
  )
}
