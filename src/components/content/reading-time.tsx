import clsx from 'clsx'
import { useRef, useEffect, useState } from 'react'
import readingTime from 'reading-time'

import styles from '@/styles/components/content/reading-time.module.css'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  wordsPerMinute?: number
}

export default function ReadingTime({ className, children, wordsPerMinute = 200 }: Props) {
  const [minutes, setTime] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref && ref.current) {
      setTime(
        Math.max(
          1,
          Math.ceil(
            readingTime(ref.current.innerText, {
              wordsPerMinute,
            }).minutes
          )
        )
      )
    }
  }, [wordsPerMinute])

  const isCalculated = minutes !== null

  return (
    <div className={clsx(isCalculated ? styles.calculated : undefined, className)}>
      <div className={styles.info} aria-hidden={!isCalculated}>
        {isCalculated ? `${minutes} minute read` : 'loading read time'}
      </div>
      <div ref={ref}>{children}</div>
    </div>
  )
}
