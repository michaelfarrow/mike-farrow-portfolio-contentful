import '@/styles/globals.scss'

import type { AppProps } from 'next/app'
import clsx from 'clsx'
import { DM_Mono, Sora } from 'next/font/google'

// Jost, Sora

import Header from '@/components/global/header'

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div id="page-wrapper" className={clsx(monospace.variable, body.variable)}>
      <Header home={!!pageProps.home} />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}
