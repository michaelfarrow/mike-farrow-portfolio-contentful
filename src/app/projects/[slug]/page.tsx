import { notFound } from 'next/navigation'

import getData from './data'
import ProjectPage from './project-page'

import { getEntries } from '@/lib/contentful'

export interface Params {
  slug: string
}

export async function generateStaticParams() {
  const projects = await getEntries({
    content_type: 'project',
  })
  return projects.map((project) => ({
    slug: project.fields.slug,
  }))
}

export default async function Page({ params: { slug } }: { params: Params }) {
  const { project } = await getData(slug)

  if (project) return <ProjectPage project={project} />

  return notFound()
}
