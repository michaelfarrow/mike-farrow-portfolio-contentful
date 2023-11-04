import clsx from 'clsx'

import settings from '@/lib/settings'
import typography from '@/styles/typography.module.scss'

export default async function Page() {
  const s = await settings('home')
  const blurb = s.text('blurb')

  return (
    <>
      {(blurb && <p className={clsx(typography.large, typography.highlight)}>{blurb}</p>) || null}
    </>
  )
}
