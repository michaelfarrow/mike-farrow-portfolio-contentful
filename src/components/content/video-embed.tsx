'use client'

import { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube'

import { IContentVideoEmbed } from '@t/contentful'
import { styleWithVars } from '@/lib/style'
import EventBus from '@/lib/event-bus'
import styles from '@/styles/components/content/video-embed.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentVideoEmbed
  sizes?: string
}

const YOUTUBE_REGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

export default function VideoEmbed({
  className,
  style,
  entry: {
    fields: { name, url, width, height },
  },
  sizes,
  ...rest
}: Props) {
  const player = useRef<YouTubePlayer>()

  const video = url.match(YOUTUBE_REGEX)

  const pause = useCallback(() => {
    if (!player.current) return
    player.current.pauseVideo()
  }, [])

  const onStateChange = (e: YouTubeEvent<number>) => {
    if (e.data === 1) {
      EventBus.dispatch('videos:pause')
      EventBus.on('videos:pause', pause)
    } else {
      EventBus.off('videos:pause', pause)
    }
  }

  const onPlayerReady = (e: YouTubeEvent) => {
    player.current = e.target
  }

  useEffect(
    () => () => {
      EventBus.off('videos:pause', pause)
    },
    [pause]
  )

  return (
    <div
      {...rest}
      className={clsx(styles.wrapper, className)}
      style={styleWithVars(
        style,
        width && height ? { '--video-embed-width': width, '--video-embed-height': height } : {}
      )}
    >
      <div className={styles.spacer} />
      {video ? (
        <YouTube
          className={styles.youtube}
          videoId={video[6]}
          title={name}
          opts={{
            playerVars: { rel: 0, modestbranding: 1 },
            host: 'https://www.youtube-nocookie.com',
          }}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
        />
      ) : (
        <span className={styles.error}>Invalid video URL</span>
      )}
    </div>
  )
}
