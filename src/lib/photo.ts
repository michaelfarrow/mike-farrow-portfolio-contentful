import http from 'http'
import { ExifParserFactory, ExifData, ExifTags } from 'ts-exif-parser'
import { unstable_cache } from 'next/cache'
import { Asset } from 'contentful'
import numToFraction from 'num2fraction'

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

export type ExifDataResponse = {
  raw: ExifTags
  processed: ProcessedExifTags
}

export function getRemoteExifData(url: string): Promise<ExifData> {
  let buff = Buffer.alloc(0)

  return new Promise((resolve, reject) => {
    http.get(url.replace(/^\/\//, 'http://'), (res) => {
      res.on('data', (chunk) => {
        buff = Buffer.concat([buff, chunk])
        if (buff.byteLength >= 65635) {
          res.destroy()
        }
      })

      res.on('close', () => {
        resolve(ExifParserFactory.create(buff).parse())
      })

      res.on('error', reject)
    })
  })
}

export async function getAssetExifData(asset: Asset): Promise<ExifDataResponse> {
  const {
    fields: {
      file: { url },
    },
    sys: { id, updatedAt },
  } = asset

  const data = await unstable_cache(() => getRemoteExifData(url), ['photo', id, updatedAt])()

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
