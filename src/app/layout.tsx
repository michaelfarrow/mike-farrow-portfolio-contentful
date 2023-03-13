import 'normalize.css'
import '@/styles/globals.css'
import 'prism-themes/themes/prism-one-light.css'
// import 'prism-themes/themes/prism-material-light.css'

import { Overpass_Mono, Lato } from 'next/font/google'
import clsx from 'clsx'

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
})

const overpassMono = Overpass_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-overpass-mono',
})

export interface Props {
  children: React.ReactNode
}

import { getEntry } from '@/lib/contentful'
import initSettings from '@/lib/settings'
import Header from '@/components/global/header'

export default async function RootLayout({ children }: Props) {
  const settings = await getEntry({
    content_type: 'settings',
    'fields.key': 'global',
  })

  const s = initSettings(settings)
  const linkedInUrl = s.url('linkedin.url')
  const linkedInLabel = s.text('linkedin.label')

  return (
    <html lang="en" className={clsx(lato.variable, overpassMono.variable)}>
      <body>
        <Header />
        {/* {(linkedInUrl && <Link href={linkedInUrl}>{linkedInLabel || 'LinkedIn'}</Link>) || null} */}
        <main>{children}</main>
      </body>
    </html>
  )
}
