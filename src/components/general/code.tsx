'use client'

import { useState } from 'react'
import { Syntax } from 'refractor'
import Refractor from 'react-refractor'
import { useTimeoutEffect } from 'react-timing-hooks'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FiCopy } from 'react-icons/fi'

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

import styles from '@/styles/components/general/code.module.scss'

// TODO: remove once library fixes
delete (Refractor as any).defaultProps

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

export interface Props extends React.ComponentPropsWithoutRef<'span'> {
  content: string
  language: Language
  filename?: string
  hideCopy?: boolean
}

export default function Code({ language, content, filename, hideCopy, ...rest }: Props) {
  const mapped: Syntax | undefined = LANGUAGE_CONFIG[language]

  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    setCopied(true)
  }

  useTimeoutEffect(
    (timeout) => {
      if (copied) {
        timeout(() => setCopied(false), 2000)
      }
    },
    [copied]
  )

  return (
    <span {...rest}>
      {(filename && <span>{filename}</span>) || null}
      {(copied && <span aria-hidden={!copied}>Copied</span>) || null}
      <Refractor className={styles.pre} language={mapped?.displayName || 'text'} value={content} />
      {(!hideCopy && (
        <CopyToClipboard text={content} onCopy={onCopy}>
          <button>
            <FiCopy />
            <span>Copy</span>
          </button>
        </CopyToClipboard>
      )) ||
        null}
    </span>
  )
}
