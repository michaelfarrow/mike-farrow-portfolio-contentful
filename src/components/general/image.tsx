'use client'

import { useState, useEffect, SyntheticEvent, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { useTimeout } from 'react-timing-hooks'

import styles from '@/styles/components/general/image.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'img'> {
  onImageLoaded?: () => void
}

export default function Image({ className, onImageLoaded, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  const image = useRef<HTMLImageElement>(null)

  const setImageLoaded = useTimeout(() => {
    setLoaded(true)
    onImageLoaded && onImageLoaded()
  }, 350)

  const _onLoad = useCallback(
    (e?: SyntheticEvent<HTMLImageElement, Event>) => {
      setImageLoaded()
    },
    [setImageLoaded]
  )

  useEffect(() => {
    if (image.current && image.current.complete) {
      _onLoad()
    }
  }, [image, _onLoad])

  return (
    <img
      loading="lazy"
      {...rest}
      className={clsx(styles.image, loaded && styles.loaded)}
      ref={image}
      onLoad={_onLoad}
    />
  )
}
