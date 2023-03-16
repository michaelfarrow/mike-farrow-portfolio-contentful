import getData from '@/app/projects/data'

export async function getStaticProps() {
  return { props: await getData() }
}

export { default } from '@/app/projects/projects-page'
