import getData from './data'
import HomePage from './home-page'

export default async function Page() {
  return <HomePage {...await getData()} />
}
