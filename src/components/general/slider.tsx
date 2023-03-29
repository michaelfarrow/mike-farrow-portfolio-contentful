import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'

import styles from '@/styles/components/general/slider.module.scss'

const PAD = 0

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  current: number
  vertical?: boolean
  onUpdate?: (current: number) => void
}

export default function VideoProgress({ className, current, vertical, onUpdate, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [interacting, setInteracting] = useState(false)

  useEffect(() => {
    const updateCurrent = (e: PointerEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      onUpdate &&
        onUpdate(Math.max(0 + PAD, Math.min(1 - PAD, vertical ? y / rect.height : x / rect.width)))
    }

    const _wrapper = ref.current

    const onPointerMove = (e: PointerEvent) => {
      if (interacting) {
        e.preventDefault()
        updateCurrent(e)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      setInteracting(true)
      updateCurrent(e)
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
  }, [interacting, vertical, onUpdate])

  return (
    <div
      ref={ref}
      className={clsx(styles.wrapper, interacting && styles.interacting, className)}
      {...rest}
      style={{ position: 'relative' }}
    >
      <div className={styles.control} style={{ transform: `translateX(${current * 100}%)` }}>
        <div className={styles.controlInner} />
      </div>
    </div>
  )
}
