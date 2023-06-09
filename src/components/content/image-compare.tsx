'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAnimationFrameLoop } from 'react-timing-hooks'

import { IContentImageCompare } from '@t/contentful'
import { styleWithVars } from '@/lib/style'
import Picture from '@/components/content/picture'
import styles from '@/styles/components/content/image-compare.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentImageCompare
  sizes?: string
}

const PAD = 0.1

export default function ImageCompare({
  className,
  style,
  entry: {
    fields: { imageA, imageB, vertical },
  },
  sizes,
  ...rest
}: Props) {
  const wrapper = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(0.5)
  const [splitCurrent, setSplitCurrent] = useState(split)
  const [interacting, setInteracting] = useState(false)
  const [loadedA, setLoadedA] = useState(false)
  const [loadedB, setLoadedB] = useState(false)

  const { start, stop } = useAnimationFrameLoop(() => {
    const current = splitCurrent + (split - splitCurrent) / 4
    setSplitCurrent(current)
    if (Math.abs(current - split) <= 0.001 && !interacting) {
      stop()
    }
  })

  useEffect(() => {
    const updateSplit = (e: PointerEvent) => {
      if (!wrapper.current) return
      const rect = wrapper.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setSplit(Math.max(0 + PAD, Math.min(1 - PAD, vertical ? y / rect.height : x / rect.width)))
    }

    const _wrapper = wrapper.current

    const onPointerMove = (e: PointerEvent) => {
      if (interacting) {
        e.preventDefault()
        updateSplit(e)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      setInteracting(true)
      start()
      updateSplit(e)
    }

    const onPointerUp = () => {
      setInteracting(false)
    }

    _wrapper && _wrapper.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      _wrapper && _wrapper.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [vertical, interacting, start])

  const onImageLoaded = (i: number) => () => {
    if (i === 0) {
      setLoadedA(true)
    } else {
      setLoadedB(true)
    }
  }

  return (
    <div
      className={clsx(
        styles.wrapper,
        vertical ? styles.wrapperVertical : styles.wrapperHorizontal,
        loadedA && loadedB ? styles.loaded : undefined,
        className
      )}
      ref={wrapper}
      style={styleWithVars(style, {
        '--image-compare-progress': splitCurrent,
      })}
      {...rest}
    >
      <div className={styles.inner}>
        {[imageA, imageB].map((image, i) => (
          <div key={i} className={styles.image}>
            <Picture entry={image} sizes={sizes} onImageLoaded={onImageLoaded(i)} />
          </div>
        ))}
        <div className={styles.control} />
      </div>
    </div>
  )
}
