import http from 'http'
import { ExifParserFactory, ExifData } from 'ts-exif-parser'
import { unstable_cache } from 'next/cache'
import { Asset } from 'contentful'

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

export function getAssetExifData(asset: Asset) {
  const {
    fields: {
      file: { url },
    },
    sys: { id, updatedAt },
  } = asset

  return unstable_cache(() => getRemoteExifData(url), ['photo', id, updatedAt])()
}
