import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import clsx from 'clsx'

import Locked from '@/components/global/locked'
import TOC from '@/components/content/toc'
import RichText from '@/components/content/page-rich-text'
import Attributions from '@/components/project/attributions'
import ReadingTime from '@/components/content/reading-time'
import DateTime from '@/components/general/date-time'
import TagList from '@/components/general/tag-list'

import typography from '@/styles/typography.module.scss'
import Picture from '@/components/general/picture'

import layout from '@/styles/layout.module.scss'
import styles from '@/styles/pages/project.module.scss'
import richTextStyles from '@/styles/pages/content/project.module.scss'

import { getEntry, getEntries } from '@/lib/contentful'

export const dynamicParams = true

export interface Params {
  slug: string
}

async function getProject(slug: string) {
  return await getEntry({
    content_type: 'project',
    include: 4,
    'fields.slug': slug,
  })
}

export async function generateMetadata({
  params: { slug },
}: {
  params: Params
}): Promise<Metadata> {
  const project = await getProject(slug)
  if (!project) return notFound()

  const {
    fields: { name, hideFromSearch, private: isPrivate },
  } = project

  return { title: name, robots: hideFromSearch || isPrivate ? 'noindex' : undefined }
}

export async function generateStaticParams() {
  const projects = await getEntries({
    content_type: 'project',
  })

  return projects.map((project) => ({
    slug: project.fields.slug,
  }))
}

export default async function Page({ params: { slug } }: { params: Params }) {
  const imageFullWidth = false

  const project = await getProject(slug)
  if (!project) return notFound()

  const {
    name,
    date,
    colour,
    categories,
    description,
    content,
    thumbnail,
    attributions,
    private: isPrivate,
  } = project.fields

  return (
    <Locked show={!isPrivate}>
      {/* <ReadingTime
        key={`/projects/${slug}`}
        content={
          <div className={clsx(styles.content, typography.textLinks)}>
            <RichText document={content} styles={{ ...richTextStyles }} />
          </div>
        }
      >
        {({ content: contentNode, minutesContent }) => ( */}
      <>
        <div
          className={clsx(
            styles.headerColumns,
            layout.columns,
            imageFullWidth && styles.imageRelative
          )}
        >
          <div
            className={clsx(
              styles.headerColumnImage,
              layout.column,
              !imageFullWidth && styles.imageRelative
            )}
          >
            {/* <div
                  className={styles.headerWrapper}
                  style={colour ? { backgroundColor: colour } : {}}
                > */}
            <Picture
              className={styles.headerImage}
              // style={colour ? { backgroundColor: colour } : {}}
              images={[{ image: thumbnail }]}
              sizes={imageFullWidth ? '100vw' : '(min-width: 1200px) 50vw, 100vw'}
            />
            {/* </div> */}
          </div>
          <div className={clsx(styles.headerColumnInfo, layout.column)}>
            <div className={styles.infoContainer}>
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
              <TOC document={content} />
            </div>
          </div>
        </div>
        <div className={clsx(styles.content, typography.textLinks)}>
          <RichText document={content} styles={{ ...richTextStyles }} />
        </div>
        {/* {contentNode} */}
      </>
      {/* )} */}
      {/* </ReadingTime> */}
      {attributions?.length ? <Attributions entries={attributions} /> : null}
    </Locked>
  )
}
