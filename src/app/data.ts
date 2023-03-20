import { getEntry } from '@/lib/contentful'

export default async function getData() {
  const settings = await getEntry({
    content_type: 'settings',
    'fields.key': 'home',
  })

  return {
    settings,
    home: true,
  }
}
