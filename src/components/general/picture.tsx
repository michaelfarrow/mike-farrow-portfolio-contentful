import { Asset } from 'contentful'
import clsx from 'clsx'
import { orderBy } from 'lodash'

import { imageAssetProps, ImageAssetParams } from '@/lib/image'
import { default as GeneralImage } from '@/components/general/image'

import styles from '@/styles/components/general/picture.module.css'

const IMAGE_SIZES = [2800, 1920, 1200, 992, 768, 576, 360]

export type AssetParams = Omit<ImageAssetParams, 'asset' | 'alt' | 'width' | 'height'> & {
  ratio?: number
}

export type ImageConfig = {
  image?: Asset
  max?: number
  params?: AssetParams
}

export interface Props extends React.ComponentPropsWithoutRef<'picture'> {
  images: ImageConfig[]
  alt?: string
  defaultWidth?: number
  maxWidth?: number
  sizes?: string
  onImageLoaded?: () => void
}

function getHeight(width: number, params?: AssetParams) {
  return params?.ratio ? width * params?.ratio : undefined
}

function createSrcSet(asset: Asset, params?: AssetParams) {
  return IMAGE_SIZES.map((size) => {
    const { src } = imageAssetProps({
      ...params,
      asset,
      width: size,
      height: getHeight(size, params),
    })
    return `${src} ${size}w`
  }).join(', ')
}

export default function Picture({
  className,
  style,
  images,
  alt,
  maxWidth,
  defaultWidth = maxWidth ? maxWidth * 2 : 1200,
  sizes = maxWidth ? `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px` : '100vw',
  onImageLoaded,
  ...rest
}: Props) {
  // Default image is our desktop image, or the last image if we can't determine
  const defaultImage = (images.find(({ max }) => !max) || images[images.length - 1]) as
    | ImageConfig
    | undefined

  const defaultImageProps =
    defaultImage?.image &&
    imageAssetProps({
      ...defaultImage.params,
      format: 'jpg',
      asset: defaultImage.image,
      alt,
      width: defaultWidth,
      height: getHeight(defaultWidth, defaultImage.params),
    })

  return (
    <picture
      className={clsx(styles.picture, className)}
      style={{ ...((maxWidth && { maxWidth }) || {}), ...style }}
      {...rest}
    >
      {orderBy(images, 'max', 'asc').map(({ max, params, image }, i) => {
        if (!image) return null
        const { width, height } = imageAssetProps({
          ...params,
          asset: image,
          width: defaultWidth,
          height: getHeight(defaultWidth, params),
        })
        return (
          (
            <source
              key={i}
              srcSet={createSrcSet(image, params)}
              width={width}
              height={height}
              media={max ? `(max-width: ${max - 1}px)` : undefined}
              sizes={sizes}
            />
          ) || null
        )
      })}
      {(defaultImageProps && (
        <GeneralImage {...defaultImageProps} onImageLoaded={onImageLoaded} />
      )) ||
        null}
    </picture>
  )
}
