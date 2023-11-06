import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import http from 'http'
import { ExifParserFactory, ExifData } from 'ts-exif-parser'

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
        sys: { updatedAt },
      } = photo
      const get = unstable_cache(() => getPhotoData(url), ['photo', url, updatedAt])
      photoData[i] = await get()
    }
  }

  return (
    <>
      <h1>{name}</h1>
      <div>
        {(photos || []).map((photo, i) => {
          const { title } = photo.fields
          const exif = photoData[i]
          const { Model, LensModel, FocalLength, ExposureTime, FNumber, ISO } = exif.tags || {}

          const photoInfo = [
            FocalLength && `${FocalLength}mm`,
            ExposureTime && `${ExposureTime}s`,
            FNumber && `f/${FNumber}`,
            ISO && `ISO ${ISO}`,
          ].filter((v) => !!v)

          return (
            <div key={i}>
              <Picture images={[{ image: photo }]} maxWidth={600} alt={title} />
              {Model && <div>{Model}</div>}
              {LensModel && <div>{LensModel}</div>}
              {(photoInfo.length && <div>{photoInfo.join(' ')}</div>) || null}
            </div>
          )
        })}
      </div>
    </>
  )
}
