import getData from './data'
import EntryLink from '@/components/general/entry-link'

export interface Props extends Awaited<ReturnType<typeof getData>> {}

export default function ProjectsPage({ projects }: Props) {
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
