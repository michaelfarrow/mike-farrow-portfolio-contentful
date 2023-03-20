import clsx from 'clsx'

import getData from './data'

import { NonNullableObject } from '@/lib/types'
import TOC from '@/components/content/toc'
import RichText from '@/components/content/page-rich-text'
import Attributions from '@/components/project/attributions'
import ReadingTime from '@/components/content/reading-time'
import DateTime from '@/components/general/date-time'
import TagList from '@/components/general/tag-list'

import styles from '@/styles/pages/project.module.css'
import richTextStyles from '@/styles/pages/content/project.module.css'
import typography from '@/styles/typography.module.css'
import Picture from '@/components/general/picture'

export interface Props extends NonNullableObject<Awaited<ReturnType<typeof getData>>> {}

export default function ProjectPage({
  project: {
    fields: { name, slug, date, colour, categories, description, content, thumbnail, attributions },
  },
}: Props) {
  return (
    <>
      <ReadingTime
        key={`/projects/${slug}`}
        content={
          <div className={clsx(styles.content, typography.textLinks)}>
            <RichText document={content} styles={{ ...richTextStyles }} />
          </div>
        }
      >
        {({ content: contentNode, minutesContent }) => (
          <>
            <div className={styles.columns}>
              <div className={styles.column}>
                <div
                  className={styles.headerWrapper}
                  style={colour ? { backgroundColor: colour } : {}}
                >
                  <Picture
                    className={styles.headerImage}
                    images={[{ image: thumbnail }]}
                    sizes="(min-width: 1200px) 50vw, 100vw"
                  />
                </div>
              </div>
              <div className={styles.column}>
                <h1 className={clsx(typography.h1, styles.title)}>{name}</h1>
                {(description && <p className={styles.description}>{description}</p>) || null}
                <div className={styles.info}>
                  {(categories?.length && (
                    <TagList tags={categories.map(({ fields: { name } }) => name)} />
                  )) ||
                    null}
                  <p className={styles.date}>
                    <DateTime str={date} format="MMMM YYYY" />
                  </p>
                </div>
                {/* {minutesContent} */}
                {/* <TOC document={content} /> */}
              </div>
            </div>
            {contentNode}
          </>
        )}
      </ReadingTime>
      {attributions?.length ? <Attributions entries={attributions} /> : null}
    </>
  )
}
