import { IContentImage } from '@t/contentful'
import { styleWithVars } from '@/lib/style'
import Picture from '@/components/content/picture'
import styles from '@/styles/components/content/image.module.scss'
import clsx from 'clsx'

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
      className={clsx(styles.figure, className)}
      style={styleWithVars(style, maxWidth && { '--picture-max-width': `${maxWidth}px` })}
      {...rest}
    >
      <Picture entry={entry} maxWidth={maxWidth} sizes={sizes} />
      {(caption && <figcaption className={styles.caption}>{caption}</figcaption>) || null}
    </figure>
  )
}
