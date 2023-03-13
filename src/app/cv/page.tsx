import getData from './data'
import CvPage from './cv-page'

export default async function Page() {
  return <CvPage {...await getData()} />
}
