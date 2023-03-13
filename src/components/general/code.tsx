import Refractor from 'react-refractor'
import { Syntax } from 'refractor'

import arduino from 'refractor/lang/arduino'
import c from 'refractor/lang/c'
import csharp from 'refractor/lang/csharp'
import cpp from 'refractor/lang/cpp'
import css from 'refractor/lang/css'
import jsx from 'refractor/lang/jsx'
import json from 'refractor/lang/json'
import markup from 'refractor/lang/markup'
import tsx from 'refractor/lang/tsx'
import scss from 'refractor/lang/scss'
import bash from 'refractor/lang/bash'
import shellSession from 'refractor/lang/shell-session'

import styles from '@/styles/components/general/code.module.css'

const LANGUAGE_CONFIG = {
  arduino,
  c,
  csharp,
  cpp,
  css,
  json,
  jsx,
  markup,
  tsx,
  scss,
  bash,
  shellSession,
}

Object.entries(LANGUAGE_CONFIG).forEach(([{}, lang]) => {
  Refractor.registerLanguage(lang)
})

export type Language = keyof typeof LANGUAGE_CONFIG

export interface Props {
  content: string
  language: Language
}

export default function Code({ language, content }: Props) {
  const mapped: Syntax | undefined = LANGUAGE_CONFIG[language]
  return (
    <Refractor className={styles.pre} language={mapped?.displayName || 'text'} value={content} />
  )
}
