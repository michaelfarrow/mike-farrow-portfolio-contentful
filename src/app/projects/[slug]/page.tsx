import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import getData from './data'
import ProjectPage from './project-page'

import { getEntries } from '@/lib/contentful'

export interface Params {
  slug: string
}

export async function generateMetadata({
  params: { slug },
}: {
  params: Params
}): Promise<Metadata> {
  const { project } = await getData(slug)
  if (!project) return notFound()

  const {
    fields: { name, hideFromSearch },
  } = project

  return { title: name, robots: hideFromSearch ? 'noindex' : undefined }
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
  if (!project) return notFound()

  return <ProjectPage project={project} />
}
