import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useAnimationFrameLoop } from 'react-timing-hooks'

import { styleWithVars } from '@/lib/style'
import styles from '@/styles/components/general/progress.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  min?: number
  max?: number
  current: number
  animate?: boolean
}

export default function Progress({
  className,
  style,
  min = 0,
  max = 100,
  current,
  animate,
  ...rest
}: Props) {
  const [inc, setInc] = useState(0)

  const { start, stop } = useAnimationFrameLoop(() => {
    setInc(current === 0 ? 0 : inc + (current - inc) / 10)
  })

  useEffect(() => {
    if (animate) {
      start()
    } else {
      stop()
    }
  }, [animate, start, stop])

  const percent =
    min === max
      ? 0
      : ((Math.min(max, Math.max(animate === undefined ? current : inc, min)) - min) /
          (max - min)) *
        100

  return (
    <div
      className={clsx(styles.wrapper, className)}
      style={styleWithVars(style, { '--progress-percent': percent / 100 })}
      {...rest}
    >
      <span className={styles.bar} />
      <span className={styles.label}>{percent}</span>
    </div>
  )
}
