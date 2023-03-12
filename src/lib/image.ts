import { Asset } from 'contentful'

export type ImageAssetParams = {
  asset: Asset
  alt?: string
  width?: number
  height?: number
  quality?: number
  format?: 'jpg' | 'png' | 'webp' | 'gif' | 'avif'
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb'
  focus?:
    | 'center'
    | 'top'
    | 'right'
    | 'left'
    | 'bottom'
    | 'top_right'
    | 'top_left'
    | 'bottom_right'
    | 'bottom_left'
    | 'face'
    | 'faces'
}

export function imageAssetProps({
  asset: {
    fields: {
      file: {
        url: src,
        details: { image: imageDetails },
      },
      title: assetAlt,
    },
  },
  alt,
  width,
  height,
  quality = 70,
  format = 'webp',
  fit,
  focus,
}: ImageAssetParams) {
  const params = {
    fm: format,
    q: quality,
    fit,
    f: focus,
    w: width,
    h: height,
  }

  let _width = imageDetails?.width
  let _height = imageDetails?.height

  if (width && height) {
    switch (fit) {
      case 'pad': // contain
      case 'fill': // cover
      case 'scale': // stretch
      case 'thumb': // ? look just like cover
        _width = width
        _height = height
        break
    }
  }

  return {
    src: `${src}?${Object.entries(params)
      .filter(([{}, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')}`,
    alt: alt || assetAlt,
    width: _width,
    height: _height,
  }
}
