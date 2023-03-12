import { IContentImage } from '@t/contentful'
import Picture from '@/components/general/picture'
import styles from '@/styles/components/content/image.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'figure'> {
  entry: IContentImage
}

export default function Image({
  className,
  style,
  entry: {
    fields: { name, image, mobileImage, caption, maxWidth },
  },
  ...rest
}: Props) {
  return (
    <figure
      className={styles.figure}
      style={{ ...((maxWidth && { maxWidth }) || {}), ...style }}
      {...rest}
    >
      <Picture
        alt={name}
        images={[
          {
            max: 800,
            image: mobileImage,
          },
          {
            image,
          },
        ]}
      />
      {(caption && <figcaption className={styles.caption}>{caption}</figcaption>) || null}
    </figure>
  )
}
