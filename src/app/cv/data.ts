import { getEntries, getEntry } from '@/lib/contentful'

export default async function getData() {
  const settings = await getEntry({
    content_type: 'settings',
    'fields.key': 'cv',
  })

  const experience = await getEntries({
    content_type: 'cvExperience',
    order: '-fields.from',
    include: 2,
  })

  const education = await getEntries({
    content_type: 'cvEducation',
    order: '-fields.from',
    include: 2,
  })

  const skills = await getEntries({
    content_type: 'cvSkill',
    'fields.root': true,
    order: 'fields.name',
    include: 10,
  })

  return {
    settings,
    experience,
    education,
    skills,
  }
}
