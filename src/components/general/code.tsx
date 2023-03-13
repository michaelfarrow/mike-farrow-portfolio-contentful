import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'

import arduino from 'react-syntax-highlighter/dist/cjs/languages/prism/arduino'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp'
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import shellSession from 'react-syntax-highlighter/dist/cjs/languages/prism/shell-session'

import styles from '@/styles/components/general/code.module.css'

const LANGUAGE_CONFIG = {
  arduino,
  c,
  csharp,
  cpp,
  css,
  markup,
  tsx,
  scss,
  bash,
  shellSession,
  json,
}

export type Language = keyof typeof LANGUAGE_CONFIG

Object.entries(LANGUAGE_CONFIG).forEach(([key, lang]) => {
  SyntaxHighlighter.registerLanguage(key, lang)
})

interface Props {
  content: string
  language: Language
}

export default function Code({ language, content }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SyntaxHighlighter
      className={clsx(styles.pre, `language-${language}`, mounted && styles.mounted)}
      language={language}
      useInlineStyles={false}
    >
      {content}
    </SyntaxHighlighter>
  )
}
