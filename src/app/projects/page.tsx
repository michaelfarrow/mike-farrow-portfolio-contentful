import getData from './data'
import ProjectsPage from './projects-page'

export default async function Page() {
  return <ProjectsPage {...await getData()} />
}
