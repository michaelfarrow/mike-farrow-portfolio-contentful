import { getEntries } from '@/lib/contentful'

import EntryLink from '@/components/general/entry-link'

export default async function Page() {
  const albums = await getEntries({
    content_type: 'photoAlbum',
    order: '-fields.date',
  })

  return (
    <ul>
      {albums.map((album, i) => {
        const {
          fields: { name },
        } = album

        return (
          <li key={i}>
            <EntryLink entry={album}>{name}</EntryLink>
          </li>
        )
      })}
    </ul>
  )
}
