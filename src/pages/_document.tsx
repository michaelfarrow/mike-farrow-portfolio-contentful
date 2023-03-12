import { Html, Head, Main, NextScript } from 'next/document'
import { LIVE_PREVIEW } from '@/lib/contentful'
import Link from 'next/link'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        {(LIVE_PREVIEW && (
          <div style={{ position: 'fixed', top: '1em', right: '1em' }}>
            Preview Mode, <Link href="/api/exit-preview">Exit</Link>
          </div>
        )) ||
          null}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
