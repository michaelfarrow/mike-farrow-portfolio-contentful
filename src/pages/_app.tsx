import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import clsx from 'clsx'
import { Overpass_Mono, Lato } from 'next/font/google'

import Header from '@/components/global/header'

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div id="page-wrapper" className={clsx(lato.variable, overpassMono.variable)}>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}
