import clsx from 'clsx'

import { IContentVideo } from '@t/contentful'
import styles from '@/styles/components/content/video.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentVideo
}

const YOUTUBE_REGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

export default function Video({
  className,
  entry: {
    fields: { url },
  },
  ...rest
}: Props) {
  const video = url.match(YOUTUBE_REGEX)

  return (
    <div {...rest} className={clsx(styles.wrapper, className)}>
      {video ? (
        <iframe
          className={styles.iframe}
          width="560"
          height="315"
          src={`https://www.youtube-nocookie.com/embed/${video[6]}?controls=0&rel=0&modestbranding&title=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <span className={styles.error}>Invalid video URL</span>
      )}
    </div>
  )
}
