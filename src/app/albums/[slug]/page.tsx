import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getEntry, getEntries } from '@/lib/contentful'
import { getAssetExifData, ProcessedExifTags } from '@/lib/photo'

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

export default async function Page({ params: { slug } }: { params: Params }) {
  const album = await getAlbum(slug)
  if (!album) return notFound()

  const { name, photos = [] } = album.fields
  const photoData: ProcessedExifTags[] = []

  for (let i = 0; i < photos.length; i++) {
    photoData[i] = (await getAssetExifData(photos[i])).processed
  }

  return (
    <>
      <h1>{name}</h1>
      <div>
        {photos.map((photo, i) => {
          const { title } = photo.fields
          const { camera, lens, settings } = photoData[i]
          const settingsArray = Object.values(settings).filter((v) => !!v)

          return (
            <div key={i}>
              <figure>
                <Picture images={[{ image: photo }]} maxWidth={600} alt={title} />
                {((camera || lens || settingsArray.length) && (
                  <figcaption>
                    {camera && <div>{camera}</div>}
                    {lens && <div>{lens}</div>}
                    {(settingsArray.length && <div>{settingsArray.join(' ')}</div>) || null}
                  </figcaption>
                )) ||
                  null}
              </figure>
            </div>
          )
        })}
      </div>
    </>
  )
}
