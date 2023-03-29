import { useRef, useState } from 'react'
import clsx from 'clsx'
import useMouse from '@react-hook/mouse-position'
import formatDuration from 'format-duration'

import { styleWithVars } from '@/lib/style'
import Progress from '@/components/general/progress'
import styles from '@/styles/components/general/video-progress.module.scss'

const SEEK_PAD = 25

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  duration: number
  currentTime: number
  onSeek?: (t: number) => void
}

export default function VideoProgress({
  className,
  style,
  duration,
  currentTime,
  onSeek,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
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

  let seekPercent = hover && mouse.x && mouse.elementWidth ? mouse.x / mouse.elementWidth : 0

  // if (mouse.elementWidth) {
  //   seekPos = Math.max(SEEK_PAD, Math.min(mouse.elementWidth - SEEK_PAD, seekPos))
  // }

  return (
    <div
      className={clsx(styles.wrapper, className)}
      style={styleWithVars(style, { '--video-progress-seek-percent': seekPercent })}
      {...rest}
    >
      <div
        ref={ref}
        className={styles.inner}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
      >
        <span className={styles.background}>
          <span className={styles.seek} />
          <Progress className={styles.progress} max={duration} current={currentTime} animate />
        </span>
        <span className={styles.label}>
          <span className={styles.labelInner}>
            {(hover && formatDuration(duration * pos * 1000)) || ''}
          </span>
        </span>
      </div>
    </div>
  )
}
