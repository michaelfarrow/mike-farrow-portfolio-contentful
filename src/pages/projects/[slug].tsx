import getData from '@/app/projects/[slug]/data'
import { Params, generateStaticParams } from '@/app/projects/[slug]/page'
import ProjectPage from '@/app/projects/[slug]/project-page'
import { Handle404 } from '@/lib/page'

export async function getStaticPaths() {
  return {
    paths: (await generateStaticParams()).map((params) => ({ params })),
    fallback: true,
  }
}

export async function getStaticProps({ params: { slug } }: { params: Params }) {
  const props = await getData(slug)
  if (!props.project) return { notFound: true }
  return { props }
}

export default Handle404(ProjectPage)
