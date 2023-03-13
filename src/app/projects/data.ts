import { getEntries } from '@/lib/contentful'

export default async function getData() {
  const projects = await getEntries({
    content_type: 'project',
    order: '-fields.date',
    include: 2,
  })

  return {
    projects,
  }
}
