import { useRef, useState } from 'react'
import clsx from 'clsx'
import useMouse from '@react-hook/mouse-position'
import formatDuration from 'format-duration'

import Progress from '@/components/general/progress'
import styles from '@/styles/components/general/video-progress.module.css'

const SEEK_PAD = 25

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  duration: number
  currentTime: number
  onSeek?: (t: number) => void
}

export default function VideoProgress({
  className,
  duration,
  currentTime,
  onSeek,
  ...rest
}: Props) {
  const ref = useRef(null)
  const mouse = useMouse(ref, {})

  const pos = mouse.elementWidth !== null && mouse.x !== null ? mouse.x / mouse.elementWidth : 0

  const [hover, setHover] = useState(false)

  const onMouseOver = () => {
    setHover(true)
  }

  const onMouseOut = () => {
    setHover(false)
  }

  const onClick = () => {
    onSeek && onSeek(pos)
  }

  let seekPos = hover && mouse.x && mouse.elementWidth ? mouse.x : 0

  if (mouse.elementWidth) {
    seekPos = Math.max(SEEK_PAD, Math.min(mouse.elementWidth - SEEK_PAD, seekPos))
  }

  return (
    <div className={clsx(styles.wrapper, className)} {...rest}>
      <div
        ref={ref}
        className={styles.inner}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
      >
        <span className={styles.background}>
          <span
            className={styles.seek}
            style={{
              transform: `scaleX(${hover ? pos : 0})`,
            }}
          />
          <Progress className={styles.progress} max={duration} current={currentTime} animate />
        </span>
        <span
          className={styles.label}
          style={{
            transform: `translateX(${seekPos}px)`,
          }}
        >
          <span className={styles.labelInner}>
            {(hover && formatDuration(duration * pos * 1000)) || ''}
          </span>
        </span>
      </div>
    </div>
  )
}
