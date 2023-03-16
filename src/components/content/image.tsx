import { IContentImage } from '@t/contentful'
import Picture from '@/components/content/picture'
import styles from '@/styles/components/content/image.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'figure'> {
  entry: IContentImage
  sizes?: string
}

export default function Image({
  className,
  style,
  entry,
  entry: {
    fields: { caption, maxWidth },
  },
  sizes,
  ...rest
}: Props) {
  return (
    <figure
      className={styles.figure}
      style={{ ...((maxWidth && { maxWidth }) || {}), ...style }}
      {...rest}
    >
      <Picture entry={entry} maxWidth={maxWidth} sizes={sizes} />
      {(caption && <figcaption className={styles.caption}>{caption}</figcaption>) || null}
    </figure>
  )
}
