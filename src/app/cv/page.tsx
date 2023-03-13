import getData from './data'
import CvPage from './cv-page'

export default async function Page() {
  const data = await getData()
  return <CvPage {...data} />
}
