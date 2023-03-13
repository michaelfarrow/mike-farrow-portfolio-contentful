import getData from './data'
import ProjectsPage from './projects-page'

export default async function Page() {
  const data = await getData()
  return <ProjectsPage {...data} />
}
