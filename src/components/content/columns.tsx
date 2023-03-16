import clsx from 'clsx'

import { IContentColumns } from '@t/contentful'
import RichText from '@/components/content/page-rich-text'

import styles from '@/styles/components/content/columns.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentColumns
}

export default function PageRichText({
  className,
  entry: {
    fields: { primary, secondary, reversed },
  },
  ...rest
}: Props) {
  return (
    <div
      className={clsx(styles.wrapper, (reversed && styles.reversed) || undefined, className)}
      {...rest}
    >
      {[primary, secondary].map((document, i) => (
        <RichText
          key={i}
          className={styles.column}
          document={document}
          sizes="(min-width: 1200px) 50vw, 100vw"
        />
      ))}
    </div>
  )
}
