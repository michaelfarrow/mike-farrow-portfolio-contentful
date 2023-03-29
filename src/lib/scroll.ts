import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

export interface State {
  vertical: number
  horizontal: number
}

export interface UseScrollPositionOptions {
  onProgress?: (data: { position: State; percentage: State }) => void
  windowScroll?: boolean
  timeout?: number
}

export const useScrollPosition = <T extends HTMLElement>(options?: UseScrollPositionOptions) => {
  const { onProgress, windowScroll, timeout } = options || {}

  const ref = useRef<T>(null)
  const [position, setPosition] = useState<State>({
    vertical: 0,
    horizontal: 0,
  })
  const [percentage, setPercentage] = useState<State>({
    vertical: 0,
    horizontal: 0,
  })

  useEffect(() => {
    let mounted = true

    const container = windowScroll ? document.scrollingElement! : ref.current
    const listener = windowScroll ? document : ref.current

    const handleScroll = debounce(() => {
      if (mounted && container) {
        const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } =
          container

        setPosition({ vertical: scrollTop, horizontal: scrollLeft })

        const verticalProgress = Math.abs((scrollTop / (scrollHeight - clientHeight)) * 100)
        const horizontalProgress = Math.abs((scrollLeft / (scrollWidth - clientWidth)) * 100)

        const position = {
          vertical: scrollTop,
          horizontal: scrollLeft,
        }

        const percentage = {
          vertical: isNaN(verticalProgress) ? 0 : verticalProgress,
          horizontal: isNaN(horizontalProgress) ? 0 : horizontalProgress,
        }

        setPosition(position)
        setPercentage(percentage)
        onProgress?.({ position, percentage })
      }
    }, timeout ?? 10)

    listener?.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => {
      mounted = false
      listener?.removeEventListener('scroll', handleScroll)
    }
  }, [onProgress, ref, timeout, windowScroll])

  return { percentage, position, ref }
}
