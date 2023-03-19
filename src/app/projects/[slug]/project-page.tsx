import clsx from 'clsx'

import getData from './data'

import { NonNullableObject } from '@/lib/types'
import TOC from '@/components/content/toc'
import RichText from '@/components/content/page-rich-text'
import Attributions from '@/components/project/attributions'
import ReadingTime from '@/components/content/reading-time'

import styles from '@/styles/pages/project.module.css'
import richTextStyles from '@/styles/pages/content/project.module.css'
import typography from '@/styles/typography.module.css'

export interface Props extends NonNullableObject<Awaited<ReturnType<typeof getData>>> {}

export default function ProjectPage({
  project: {
    fields: { name, slug, content, attributions },
  },
}: Props) {
  return (
    <>
      <h1 className={typography.h1}>{name}</h1>
      <TOC document={content} />
      <ReadingTime key={`/projects/${slug}`}>
        <div className={clsx(styles.content, typography.textLinks)}>
          <RichText document={content} styles={richTextStyles} />
        </div>
      </ReadingTime>
      {attributions?.length ? <Attributions entries={attributions} /> : null}
    </>
  )
}
