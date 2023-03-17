import { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { FiMaximize, FiPlay, FiPause } from 'react-icons/fi'
import { useTimeout } from 'react-timing-hooks'

import EventBus from '@/lib/event-bus'
import VideoProgress from '@/components/general/video-progress'

import styles from '@/styles/components/general/video.module.css'

type CrossPlatformDocument = Document & {
  webkitExitFullscreen?: () => {}
}

type CrossPlatformHTMLVideoElement = HTMLVideoElement & {
  webkitEnterFullScreen?: () => {}
}

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  src: string
  title?: string
  width?: number
  height?: number
  timeout?: number
  background?: boolean
  controls?: boolean
}

export default function Video({
  className,
  src,
  title,
  width = 1920,
  height = 1080,
  timeout = 1,
  background,
  controls,
  // coverImage,
  children,
  ...rest
}: Props) {
  const video: React.MutableRefObject<CrossPlatformHTMLVideoElement | null> = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [fullscreenSupported, setFullscreenSupported] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [controlsInteracting, setControlsInteracting] = useState(false)
  const [interactionTimeout, setInteractionTimeout] = useState<number | NodeJS.Timeout>()

  const play = () => {
    EventBus.dispatch('videos:pause')
    video.current && video.current.play()
  }

  const pause = useCallback(() => {
    video.current && video.current.pause()
  }, [])

  const onPlay = () => {
    if (video.current)
      setFullscreenSupported(
        Boolean(video.current.webkitEnterFullScreen || video.current.requestFullscreen)
      )
    setPlaying(true)
  }

  const onPause = () => {
    setPlaying(false)
  }

  const onEnded = () => {
    setPlaying(false)
    setCurrentTime(0)
    if (video.current) video.current.currentTime = 0
    const _document: CrossPlatformDocument = document
    try {
      if (_document.webkitExitFullscreen) {
        _document.webkitExitFullscreen()
      } else {
        document.exitFullscreen()
      }
    } catch (e) {}
  }

  const onTimeUpdate = () => {
    if (!video.current) return
    const { currentTime, duration } = video.current
    setCurrentTime(currentTime)
    setDuration(duration)
  }

  const onPlayPauseClick = () => {
    onInteractionStart()
    if (playing) {
      pause()
    } else {
      play()
    }
  }

  const onFullScreenClick = () => {
    if (video.current) {
      try {
        if (video.current.webkitEnterFullScreen) {
          video.current.webkitEnterFullScreen()
        } else {
          video.current.requestFullscreen()
        }
      } catch (e) {}
    }
  }

  const onSeek = (t: number) => {
    if (video.current) video.current.currentTime = duration * t
    play()
  }

  const clearInteractionTimeout = () => {
    if (interactionTimeout !== undefined) {
      clearTimeout(interactionTimeout)
    }
    setInteractionTimeout(undefined)
  }

  const delayedClearInteractionTimeout = useTimeout(() => {
    clearInteractionTimeout()
  }, timeout * 1000)

  const onInteractionEnd = () => {
    clearInteractionTimeout()
  }

  const onInteractionStart = () => {
    clearInteractionTimeout()
    setInteractionTimeout(delayedClearInteractionTimeout())
  }

  const onControlEnter = () => {
    setControlsInteracting(true)
  }

  const onControlLeave = () => {
    setControlsInteracting(false)
  }

  useEffect(() => {
    !background && EventBus.on('videos:pause', pause)
    return () => {
      EventBus.off('videos:pause', pause)
    }
  }, [pause, background])

  return (
    <div
      className={clsx(
        styles.wrapper,
        currentTime ? (playing ? styles.playing : styles.paused) : styles.stopped,
        interactionTimeout !== undefined || controlsInteracting ? styles.interacting : null,
        className
      )}
      onMouseMove={onInteractionStart}
      onMouseLeave={onInteractionEnd}
      {...rest}
    >
      {(!children && (
        <div
          className={styles.spacer}
          style={width && height ? { paddingTop: `${(height / width) * 100}%` } : {}}
        />
      )) ||
        null}
      <video
        className={styles.video}
        title={title}
        ref={video}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        loop={background}
        autoPlay={background}
        muted={background}
      >
        <source src={src} />
      </video>
      {(children && <div className={styles.poster}>{children}</div>) || null}
      {(controls && (
        <>
          <button
            className={styles.button}
            onClick={onPlayPauseClick}
            onFocus={onInteractionStart}
            onBlur={onInteractionEnd}
          >
            <FiPause className={styles.pause} />
            <FiPlay className={styles.play} />
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
          {(fullscreenSupported && (
            <button
              className={styles.fullScreen}
              onClick={onFullScreenClick}
              onMouseEnter={onControlEnter}
              onMouseLeave={onControlLeave}
              onFocus={onControlEnter}
              onBlur={onControlLeave}
              disabled={!playing}
            >
              <FiMaximize />
              <span>Full Screen</span>
            </button>
          )) ||
            null}
          <VideoProgress
            className={styles.progress}
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
            onMouseEnter={onControlEnter}
            onMouseLeave={onControlLeave}
          />
        </>
      )) ||
        null}
    </div>
  )
}
