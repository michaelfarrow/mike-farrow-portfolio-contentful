import http from 'http'
import { ExifParserFactory, ExifData } from 'ts-exif-parser'
import numToFraction from 'num2fraction'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'

import { getEntry, getEntries } from '@/lib/contentful'

import Picture from '@/components/general/picture'

export interface Params {
  slug: string
}

async function getAlbum(slug: string) {
  return await getEntry({
    content_type: 'photoAlbum',
    include: 4,
    'fields.slug': slug,
  })
}

export async function generateMetadata({
  params: { slug },
}: {
  params: Params
}): Promise<Metadata> {
  const project = await getAlbum(slug)
  if (!project) return notFound()

  const {
    fields: { name },
  } = project

  return { title: name }
}

export async function generateStaticParams() {
  const albums = await getEntries({
    content_type: 'photoAlbum',
  })

  return albums.map((album) => ({
    slug: album.fields.slug,
  }))
}

function getPhotoData(url: string): Promise<ExifData> {
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

export default async function Page({ params: { slug } }: { params: Params }) {
  const album = await getAlbum(slug)
  if (!album) return notFound()

  const { name, photos } = album.fields
  const photoData: ExifData[] = []

  if (photos) {
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      const {
        fields: {
          file: { url },
        },
        sys: { id, updatedAt },
      } = photo
      photoData[i] = await unstable_cache(() => getPhotoData(url), ['photo', id, updatedAt])()
    }
  }

  return (
    <>
      <h1>{name}</h1>
      <div>
        {(photos || []).map((photo, i) => {
          const { title } = photo.fields
          const exif = photoData[i]
          const {
            Model: model,
            LensModel: lens,
            FocalLength: focalLength,
            ExposureTime: exposure,
            FNumber: aperture,
            ISO: iso,
            ExposureCompensation: exposureCompensation,
          } = exif.tags || {}

          const photoInfo = [
            aperture && `f/${aperture}`,
            exposure && (exposure < 1 ? numToFraction(exposure) : `${exposure}"`),
            iso && `ISO${iso}`,
            focalLength && `${focalLength}mm`,
            exposureCompensation && `+/- ${exposureCompensation}`,
          ].filter((v) => !!v)

          return (
            <div key={i}>
              <Picture images={[{ image: photo }]} maxWidth={600} alt={title} />
              {model && (
                <div>
                  {model.replace(/[mM](\d)+/g, ({}, digit: number) => ` Mark ${'I'.repeat(digit)}`)}
                </div>
              )}
              {lens && <div>{lens.replace(/(?<=RF)(?=\d)/g, ' ')}</div>}
              {(photoInfo.length && <div>{photoInfo.join(' ')}</div>) || null}
            </div>
          )
        })}
      </div>
    </>
  )
}
