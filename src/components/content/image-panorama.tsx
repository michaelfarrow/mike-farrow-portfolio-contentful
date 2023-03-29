'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import useMouse from '@react-hook/mouse-position'
import { useAnimationFrameLoop } from 'react-timing-hooks'

import { IContentImagePanorama } from '@t/contentful'
import { styleWithVars } from '@/lib/style'
import { imageAssetProps } from '@/lib/image'
import { useScrollPosition } from '@/lib/scroll'
import Image from '@/components/general/image'
import Slider from '@/components/general/slider'

import styles from '@/styles/components/content/image-panorama.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentImagePanorama
  sizes?: string
}

const PAD = 0.1

export default function ImagePanorama({
  className,
  style,
  entry: {
    fields: { name, image, maxHeight, ratio },
  },
  sizes,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { position: scrollPosition } = useScrollPosition({ windowScroll: true })
  // const mouse = useMouse(ref, {})
  const [scrollRoot, setScrollRoot] = useState(0)
  const [manualRoot, setManualRoot] = useState(0)
  const [pos, setPos] = useState(0)
  const [manualPos, setManualPos] = useState(0)
  const [targetPos, setTargetPos] = useState(0)
  // const [interacting, setInteracting] = useState(false)

  const { src } = imageAssetProps({ asset: image })

  useEffect(() => {
    const newPos = (Math.sin(scrollPosition.vertical / 3000) + 1) / 2
    setManualPos(newPos)
    setTargetPos(newPos)
  }, [scrollPosition])

  function onSliderUpdate(current: number) {
    setScrollRoot(scrollPosition.vertical)
    setManualRoot(Math.asin(current * 2 - 1))
  }

  useEffect(() => {
    setTargetPos((Math.sin(manualRoot + (scrollPosition.vertical - scrollRoot) / 3000) + 1) / 2)
  }, [scrollPosition, manualRoot, scrollRoot])

  // useEffect(() => {
  //   if (interacting && mouse.x === null) return
  //   if (interacting) {
  //     const pad = (mouse.elementWidth && mouse.elementWidth * PAD) || 0
  //     const manual =
  //       mouse.elementWidth !== null && mouse.x !== null
  //         ? Math.max(0, Math.min(1, (mouse.x - pad) / (mouse.elementWidth - pad * 2)))
  //         : 0
  //     setManualRoot(Math.asin(manual * 2 - 1))
  //     setScrollRoot(scrollPosition.vertical)
  //     setTargetPos(manual)
  //   } else {
  //     setTargetPos((Math.sin(manualRoot + (scrollPosition.vertical - scrollRoot) / 3000) + 1) / 2)
  //   }
  // }, [interacting, scrollPosition, scrollRoot, mouse, manualRoot])

  useAnimationFrameLoop(
    () => {
      const newPos = pos + (targetPos - pos) / 6
      setPos(Math.abs(pos - newPos) <= 0.00001 ? targetPos : newPos)
    },
    { startOnMount: true }
  )

  // function onMouseEnter() {
  //   setInteracting(true)
  // }

  // function onMouseLeave() {
  //   setInteracting(false)
  // }

  return (
    <div
      className={clsx(styles.wrapper, className)}
      // ref={ref}
      style={styleWithVars(style, {
        '--image-panorama-progress': pos,
        '--image-panorama-ratio': ratio,
        '--image-panorama-max-height': `${maxHeight}px`,
      })}
      {...rest}
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
    >
      <div className={styles.imageOuter}>
        <div className={styles.imageInner}>
          <Image className={styles.image} src={src} alt={name} />
        </div>
      </div>
      <Slider current={targetPos} className={styles.slider} onUpdate={onSliderUpdate} />
    </div>
  )
}
