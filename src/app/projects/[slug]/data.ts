import { getEntry } from '@/lib/contentful'

export default async function getData(slug: string) {
  const project = await getEntry({
    content_type: 'project',
    include: 4,
    'fields.slug': slug,
  })

  return {
    project,
  }
}
