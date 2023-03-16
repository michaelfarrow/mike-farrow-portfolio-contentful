import getData from '@/app/data'

export async function getStaticProps() {
  return { props: await getData() }
}

export { default } from '@/app/home-page'
