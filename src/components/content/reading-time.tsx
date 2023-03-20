import clsx from 'clsx'
import { useRef, useEffect, useState } from 'react'
import readingTime from 'reading-time'

import styles from '@/styles/components/content/reading-time.module.css'

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  content: React.ReactNode
  children?: (props: {
    content: React.ReactNode
    minutesContent: React.ReactNode
    minutes: number | null
  }) => React.ReactNode

  wordsPerMinute?: number
}

export default function ReadingTime({
  className,
  content,
  wordsPerMinute = 200,
  children = ({ content, minutesContent }) => (
    <>
      {minutesContent}
      {content}
    </>
  ),
}: Props) {
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

  return (
    <>
      {children({
        content: <div ref={ref}>{content}</div>,
        minutesContent: (
          <div
            className={clsx(
              styles.info,
              minutes !== null ? styles.calculated : undefined,
              className
            )}
            aria-hidden={!minutes !== null}
          >
            {minutes !== null ? `${minutes} minute read` : 'loading read time'}
          </div>
        ),
        minutes,
      })}
    </>
  )
}
