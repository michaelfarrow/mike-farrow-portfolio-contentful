import { IPageCv } from '@t/contentful'

import { ICvExperience, ICvEducation, ICvSkill } from '@t/contentful'
import { getEntries } from '@/lib/contentful'

export async function fetchCvPageData() {
  const experience = await getEntries<ICvExperience>({
    content_type: 'cvExperience',
    order: '-fields.from',
    include: 2,
  })

  const education = await getEntries<ICvEducation>({
    content_type: 'cvEducation',
    order: '-fields.from',
    include: 2,
  })

  const skills = await getEntries<ICvSkill>({
    content_type: 'cvSkill',
    'fields.root': true,
    order: 'fields.name',
    include: 10,
  })

  return {
    experience,
    education,
    skills,
  }
}
