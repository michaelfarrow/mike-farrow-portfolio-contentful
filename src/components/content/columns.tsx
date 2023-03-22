import clsx from 'clsx'

import { IContentColumns } from '@t/contentful'
import RichText from '@/components/content/page-rich-text'

import layout from '@/styles/layout.module.scss'
import styles from '@/styles/components/content/columns.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentColumns
  styles?: any
}

export default function PageRichText({
  className,
  entry: {
    fields: { primary, secondary, reversed },
  },
  styles: richTextStyles,
  ...rest
}: Props) {
  return (
    <div
      className={clsx(layout.columns, (reversed && layout.columnsReversed) || undefined, className)}
      {...rest}
    >
      {[primary, secondary].map((document, i) => (
        <div key={i} className={layout.column}>
          <div className={styles.content}>
            <RichText
              document={document}
              sizes="(min-width: 1200px) 50vw, 100vw"
              styles={richTextStyles}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
