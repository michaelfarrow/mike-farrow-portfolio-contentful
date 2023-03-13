// import { useState, useEffect, SyntheticEvent, useRef, useCallback } from 'react'
import clsx from 'clsx'

import styles from '@/styles/components/general/image.module.css'

// export interface Props extends React.ComponentPropsWithoutRef<'span'> {
//   src: string
//   alt: string
//   width?: number
//   height?: number
//   noPlaceholder?: boolean
// }

// export default function Image({
//   className,
//   style,
//   src,
//   alt,
//   width,
//   height,
//   noPlaceholder,
//   ...rest
// }: Props) {
//   const [loaded, setLoaded] = useState(false)
//   const [loadedAnimate, setLoadedAnimate] = useState(false)
//   const [loadedTimeout, setLoadedTimeout] = useState<number | null>(null)

//   const onLoad = () => {
//     if (!loaded) {
//       setLoaded(true)
//       setLoadedTimeout(
//         window.setTimeout(() => {
//           setLoadedAnimate(true)
//         }, 50)
//       )
//     }
//   }

//   useEffect(() => {
//     return () => {
//       if (loadedTimeout) clearTimeout(loadedTimeout)
//     }
//   }, [loadedTimeout])

//   const placeholder = !!(width && height)

//   return (
//     <span
//       {...rest}
//       className={clsx(
//         styles.wrapper,
//         placeholder && !noPlaceholder && styles.placeholder,
//         className
//       )}
//       style={{
//         ...(placeholder && !noPlaceholder ? { paddingTop: `${(height / width) * 100}%` } : {}),
//         ...(style || {}),
//       }}
//     >
//       <img
//         className={clsx(styles.image, loadedAnimate && styles.loaded)}
//         src={src}
//         ref={(ref) => {
//           if (ref && ref.complete) {
//             onLoad()
//           }
//         }}
//         alt={alt}
//         onLoad={onLoad}
//         loading="lazy"
//       />
//     </span>
//   )
// }

export interface Props extends React.ComponentPropsWithoutRef<'img'> {}

export default function Image({ className, onLoad, ...rest }: Props) {
  return <img loading="lazy" {...rest} className={clsx(styles.image)} />
  // const [loaded, setLoaded] = useState(false)
  // const [loadedAnimate, setLoadedAnimate] = useState(false)
  // const [loadedTimeout, setLoadedTimeout] = useState<number | null>(null)

  // const image = useRef<HTMLImageElement>(null)

  // const _onLoad = useCallback(
  //   (e?: SyntheticEvent<HTMLImageElement, Event>) => {
  //     e && onLoad && onLoad(e)
  //     if (!loaded) {
  //       setLoaded(true)
  //       setLoadedTimeout(
  //         window.setTimeout(() => {
  //           setLoadedAnimate(true)
  //         }, 50)
  //       )
  //     }
  //   },
  //   [loaded, onLoad]
  // )

  // useEffect(() => {
  //   return () => {
  //     if (loadedTimeout) clearTimeout(loadedTimeout)
  //   }
  // }, [loadedTimeout])

  // useEffect(() => {
  //   if (image.current && image.current.complete) {
  //     _onLoad()
  //   }
  // }, [image, _onLoad])

  // return (
  //   <img
  //     // loading="lazy"
  //     {...rest}
  //     className={clsx(styles.image, loadedAnimate && styles.loaded)}
  //     ref={image}
  //     onLoad={_onLoad}
  //   />
  // )
}
