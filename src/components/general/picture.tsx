import { Asset } from 'contentful'
import { imageAssetProps, ImageAssetParams } from '@/lib/image'
import { default as GeneralImage } from '@/components/general/image'

const IMAGE_SIZES = [2800, 1920, 1200, 992, 768, 576, 360]

export type AssetParams = Omit<ImageAssetParams, 'asset' | 'alt' | 'width' | 'height'> & {
  ratio?: number
}

export interface Props extends React.ComponentPropsWithoutRef<'picture'> {
  images: {
    image?: Asset
    max?: number
    params?: AssetParams
  }[]
  alt?: string
  defaultWidth?: number
  maxWidth?: number
  sizes?: string
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
  images,
  alt,
  maxWidth,
  defaultWidth = maxWidth ? maxWidth * 2 : 1200,
  sizes = maxWidth ? `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px` : '100vw',
  ...rest
}: Props) {
  // Default image is our desktop image, or the last image if we can't determine
  const defaultImage = images.find(({ max }) => !max) || images[images.length - 1]

  const defaultImageProps =
    defaultImage &&
    defaultImage.image &&
    imageAssetProps({
      ...defaultImage.params,
      format: 'jpg',
      asset: defaultImage.image,
      alt,
      width: defaultWidth,
      height: getHeight(defaultWidth, defaultImage.params),
    })

  return (
    <picture {...rest}>
      {images.map(({ max, params, image }, i) => {
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
      {(defaultImageProps && <GeneralImage {...defaultImageProps} />) || null}
    </picture>
  )
}
