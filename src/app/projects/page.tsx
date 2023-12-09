import { getEntries } from '@/lib/contentful'

import EntryLink from '@/components/general/entry-link'

export const dynamic = 'force-static'
export const dynamicParams = true

export default async function Page() {
  const projects = await getEntries({
    content_type: 'project',
    order: '-fields.date',
    include: 2,
  })

  return (
    <ul>
      {projects.map((project, i) => {
        const {
          fields: { name },
        } = project

        return (
          <li key={i}>
            <EntryLink entry={project}>{name}</EntryLink>
          </li>
        )
      })}
    </ul>
  )
}
