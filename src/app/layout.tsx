import '@/styles/globals.scss'

import clsx from 'clsx'
import { DM_Mono, Sora } from 'next/font/google'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'

import initSettings, { getSettings } from '@/lib/settings'
import Header from '@/components/global/header'
import DraftMode from '@/components/global/draft-mode'

export interface Props {
  children: React.ReactNode
}

const monospace = DM_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-monospace',
})

const body = Sora({
  subsets: ['latin'],
  // weight: ['400'],
  display: 'swap',
  variable: '--font-body',
})

export default async function RootLayout({ children }: Props) {
  const settings = await getSettings('global')

  const s = initSettings(settings)
  const linkedInUrl = s.text('global.linkedin.url')
  const linkedInLabel = s.text('global.linkedin.label')

  return (
    <html lang="en" className={clsx(monospace.variable, body.variable)}>
      <body>
        <div id="page-wrapper">
          {draftMode().isEnabled && (
            <p className="bg-orange-200 py-4 px-[6vw]">
              Draft mode is on! <DraftMode />
            </p>
          )}
          <Header />
          {/* {(linkedInUrl && <Link href={linkedInUrl}>{linkedInLabel || 'LinkedIn'}</Link>) || null} */}
          <main>{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
