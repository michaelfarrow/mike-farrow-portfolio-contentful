import '@/styles/globals.scss'

import clsx from 'clsx'
import { DM_Mono, Sora } from 'next/font/google'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import settings from '@/lib/settings'
import Header from '@/components/global/header'
import DraftMode from '@/components/global/draft-mode'
import Notifications from '@/components/global/notifications'

// import Link from '@/components/general/link'

export const dynamic = 'force-static'

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
  const s = await settings('global')

  // const linkedInUrl = s.text('linkedin.url')
  // const linkedInLabel = s.text('linkedin.label')

  return (
    <html lang="en" className={clsx(monospace.variable, body.variable)}>
      <body>
        <div id="page-wrapper">
          {draftMode().isEnabled && (
            <p>
              Draft mode is on! <DraftMode />
            </p>
          )}
          <Header />
          <Notifications />
          {/* {(linkedInUrl && <Link href={linkedInUrl}>{linkedInLabel || 'LinkedIn'}</Link>) || null} */}
          <main>{children}</main>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
