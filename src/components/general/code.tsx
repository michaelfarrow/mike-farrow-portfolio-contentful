// import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { camelCase } from 'change-case'
import arduino from 'react-syntax-highlighter/dist/cjs/languages/prism/arduino'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp'
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import shellSession from 'react-syntax-highlighter/dist/cjs/languages/prism/shell-session'

import style from 'react-syntax-highlighter/dist/cjs/styles/prism/material-light'
// import style from 'react-syntax-highlighter/dist/cjs/styles/prism/one-light'

import styles from '@/styles/components/general/code.module.css'

export type Language =
  | 'arduino'
  | 'c'
  | 'csharp'
  | 'cpp'
  | 'css'
  | 'markup'
  | 'tsx'
  | 'scss'
  | 'bash'
  | 'shellSession'

function registerLanguages(languages: { [key in Language]: any }) {
  Object.entries(languages).forEach(([key, lang]) => {
    SyntaxHighlighter.registerLanguage(key, lang)
  })
}

registerLanguages({
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
})

const LANGUAGE_MAP: { [key: string]: Language } = {
  'arduino-c++': 'arduino',
  'c++': 'cpp',
  'c#': 'csharp',
  javascript: 'tsx',
  shell: 'bash',
  html: 'markup',
}

interface Props {
  content: string
  language: string
}

export default function Code({ language, content }: Props) {
  const _language = camelCase(language.toLowerCase())
  const mapped: Language | undefined = LANGUAGE_MAP[_language]

  return (
    <SyntaxHighlighter className={styles.pre} language={mapped || _language} style={style}>
      {content}
    </SyntaxHighlighter>
  )
}
