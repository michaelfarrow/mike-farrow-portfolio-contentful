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

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={clsx(lato.variable, overpassMono.variable)}>
      <body>{children}</body>
    </html>
  )
}
