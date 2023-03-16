'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { IContentImageCompare } from '@t/contentful'
import Picture from '@/components/content/picture'
import styles from '@/styles/components/content/image-compare.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentImageCompare
  sizes?: string
}

const PAD = 0.1

export default function ImageCompare({
  className,
  entry: {
    fields: { imageA, imageB, vertical },
  },
  sizes,
  ...rest
}: Props) {
  const wrapper = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(0.5)

  useEffect(() => {
    const updateSplit = (e: PointerEvent) => {
      if (!wrapper.current) return
      const rect = wrapper.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setSplit(Math.max(0 + PAD, Math.min(1 - PAD, vertical ? y / rect.height : x / rect.width)))
    }

    const _wrapper = wrapper.current
    let pointerDown = false

    const onPointerMove = (e: PointerEvent) => {
      if (pointerDown) {
        e.preventDefault()
        updateSplit(e)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      pointerDown = true
      updateSplit(e)
    }

    const onPointerUp = () => (pointerDown = false)

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
  }, [vertical])

  const clipPath = [
    [1, 0],
    [1, 1],
    [split, 1],
    [split, 0],
  ]

  return (
    <div
      className={clsx(vertical ? styles.wrapperVertical : styles.wrapper, className)}
      ref={wrapper}
      {...rest}
    >
      {[imageA, imageB].map((image, i) => (
        <div
          key={i}
          className={styles.image}
          style={
            i !== 0
              ? {
                  clipPath: `polygon(${clipPath
                    .map((xy) => {
                      const xyMapped = xy.map((p) => `${p * 100}%`)
                      vertical && xyMapped.reverse()
                      return xyMapped.join(' ')
                    })
                    .join(', ')})`,
                }
              : {}
          }
        >
          <Picture entry={image} sizes={sizes} />
        </div>
      ))}
      <div className={styles.control} style={{ [vertical ? 'top' : 'left']: `${split * 100}%` }} />
    </div>
  )
}
