import 'normalize.css'
import '@/styles/globals.css'
import 'prism-themes/themes/prism-one-light.css'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
