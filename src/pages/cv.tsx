import getData from '@/app/cv/data'

export async function getStaticProps() {
  return { props: await getData() }
}

export { default } from '@/app/cv/cv-page'
