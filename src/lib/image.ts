import { unstable_cache } from 'next/cache'
import { ExifParserFactory, ExifData, ExifTags } from 'ts-exif-parser'
import { Asset } from 'contentful'
import numToFraction from 'num2fraction'

import { getRemoteBuffer } from '@/lib/file'

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

export type ProcessedExifTags = {
  camera?: string
  lens?: string
  settings: {
    aperture?: string
    shutterSpeed?: string
    iso?: string
    focalLength?: string
    exposureCompensation?: string
  }
}

export type NormalisedExifData = {
  raw: ExifTags
  processed: ProcessedExifTags
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

export async function getRemoteExifData(url: string) {
  const buffer = await getRemoteBuffer(url, 65635)
  return ExifParserFactory.create(buffer).parse()
}

export function normaliseExifData(data: ExifData): NormalisedExifData {
  const tags = data.tags || {}

  const {
    Model: model,
    LensModel: lens,
    FocalLength: focalLength,
    ExposureTime: exposure,
    FNumber: aperture,
    ISO: iso,
    ExposureCompensation: exposureCompensation,
  } = tags

  const settings: ProcessedExifTags['settings'] = {
    aperture: (aperture && `f/${aperture}`) || undefined,
    shutterSpeed:
      (exposure && (exposure < 1 ? numToFraction(exposure) : `${exposure}"`)) || undefined,
    iso: (iso && `ISO${iso}`) || undefined,
    focalLength: (focalLength && `${focalLength}mm`) || undefined,
    exposureCompensation:
      (exposureCompensation &&
        `${Number(exposureCompensation) < 0 ? '-' : '+'}${Math.abs(
          Number(exposureCompensation)
        )} EV`) ||
      undefined,
  }

  const processed: ProcessedExifTags = {
    camera: model?.replace(/[mM](\d)+/g, ({}, digit: number) => ` Mark ${'I'.repeat(digit)}`),
    lens: lens?.replace(/(?<=RF)(?=\d)/g, ' '),
    settings,
  }

  return {
    raw: tags,
    processed,
  }
}

export async function getAssetExifData(asset: Asset, cache?: boolean): Promise<NormalisedExifData> {
  const {
    fields: {
      file: { url },
    },
    sys: { id, updatedAt },
  } = asset

  const fetchData = () => getRemoteExifData(url)

  const data = await (cache
    ? unstable_cache(fetchData, ['asset-exif', id, updatedAt])()
    : fetchData())

  return normaliseExifData(data)
}
