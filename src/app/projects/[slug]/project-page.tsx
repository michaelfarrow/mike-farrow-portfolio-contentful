import clsx from 'clsx'

import getData from './data'

import { NonNullableObject } from '@/lib/types'
import TOC from '@/components/content/toc'
import RichText from '@/components/content/page-rich-text'
import Attributions from '@/components/project/attributions'
import typography from '@/styles/typography.module.css'

export interface Props extends NonNullableObject<Awaited<ReturnType<typeof getData>>> {}

export default function ProjectPage({
  project: {
    fields: { name, content, attributions },
  },
}: Props) {
  return (
    <>
      <h2 className={clsx(typography.h, typography.h2)}>{name}</h2>
      <TOC document={content} />
      <RichText document={content} />
      {attributions?.length ? <Attributions entries={attributions} /> : null}
    </>
  )
}
