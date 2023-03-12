// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset, Entry } from 'contentful'
import { Document } from '@contentful/rich-text-types'

export interface IContactCompanyFields {
  /** Name */
  name: string

  /** Link */
  link?: IContentLink | undefined
}

export interface IContactCompany extends Entry<IContactCompanyFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'contactCompany'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IContactIndividualFields {
  /** Name */
  name: string

  /** Link */
  link?: IContentLink | undefined
}

export interface IContactIndividual extends Entry<IContactIndividualFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'contactIndividual'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IContactInstitutionFields {
  /** Name */
  name: string

  /** Link */
  link?: IContentLink | undefined
}

export interface IContactInstitution extends Entry<IContactInstitutionFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'contactInstitution'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IContentCodeFields {
  /** Name */
  name?: string | undefined

  /** Language */
  language:
    | 'Arduino C++'
    | 'C'
    | 'C#'
    | 'C++'
    | 'CSS'
    | 'HTML'
    | 'JavaScript'
    | 'SCSS'
    | 'Shell'
    | 'Shell Session'

  /** Filename */
  filename?: string | undefined

  /** Content */
  content: string
}

export interface IContentCode extends Entry<IContentCodeFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'contentCode'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IContentImageFields {
  /** Name */
  name: string

  /** Image */
  image: Asset

  /** Mobile Image */
  mobileImage?: Asset | undefined

  /** Caption */
  caption?: string | undefined

  /** Max Width */
  maxWidth?: number | undefined
}

export interface IContentImage extends Entry<IContentImageFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'contentImage'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IContentLinkFields {
  /** Name */
  name: string

  /** Short Name */
  shortName?: string | undefined

  /** URL */
  url: string
}

export interface IContentLink extends Entry<IContentLinkFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'contentLink'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IContentVideoFields {
  /** Name */
  name: string

  /** URL */
  url: string
}

export interface IContentVideo extends Entry<IContentVideoFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'contentVideo'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ICvEducationFields {
  /** Institution */
  institution: IContactInstitution

  /** Qualification */
  qualification: string

  /** From */
  from: string

  /** To */
  to?: string | undefined
}

export interface ICvEducation extends Entry<ICvEducationFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'cvEducation'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ICvExperienceFields {
  /** Employer / Client */
  employer: IContactCompany | IContactIndividual | IContactInstitution

  /** Title */
  title: string

  /** From */
  from: string

  /** To */
  to?: string | undefined

  /** Description */
  description: Document
}

export interface ICvExperience extends Entry<ICvExperienceFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'cvExperience'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ICvSkillFields {
  /** Name */
  name: string

  /** Root */
  root: boolean

  /** Sub-Skills */
  subSkills?: ICvSkill[] | undefined
}

export interface ICvSkill extends Entry<ICvSkillFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'cvSkill'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IProjectFields {
  /** Name */
  name: string

  /** Slug */
  slug: string

  /** Date */
  date: string

  /** Thumbnail */
  thumbnail: Asset

  /** Client */
  client?: IContactCompany | IContactIndividual | IContactInstitution | undefined

  /** Content */
  content: Document

  /** Attributions */
  attributions?: IProjectAttribution[] | undefined
}

export interface IProject extends Entry<IProjectFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'project'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IProjectAttributionFields {
  /** Name */
  name: string

  /** Short Name */
  shortName: string

  /** Attributions */
  attributions: (IContactCompany | IContactIndividual | IContactInstitution)[]
}

export interface IProjectAttribution extends Entry<IProjectAttributionFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'projectAttribution'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ISettingsFields {
  /** Name */
  name: string

  /** Key */
  key: 'cv' | 'home' | 'projects'

  /** Items */
  items?:
    | (
        | ISettingsDecimal
        | ISettingsInteger
        | ISettingsRichText
        | ISettingsText
        | ISettingsTextList
        | ISettingsUrl
      )[]
    | undefined
}

export interface ISettings extends Entry<ISettingsFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'settings'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ISettingsDecimalFields {
  /** Key */
  key: string

  /** Value */
  value: number
}

export interface ISettingsDecimal extends Entry<ISettingsDecimalFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'settingsDecimal'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ISettingsIntegerFields {
  /** Key */
  key: string

  /** Value */
  value: number
}

export interface ISettingsInteger extends Entry<ISettingsIntegerFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'settingsInteger'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ISettingsRichTextFields {
  /** Key */
  key: string

  /** Value */
  value: Document
}

export interface ISettingsRichText extends Entry<ISettingsRichTextFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'settingsRichText'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ISettingsTextFields {
  /** Key */
  key: string

  /** Value */
  value: string
}

export interface ISettingsText extends Entry<ISettingsTextFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'settingsText'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ISettingsTextListFields {
  /** Key */
  key: string

  /** Value */
  value: string[]
}

export interface ISettingsTextList extends Entry<ISettingsTextListFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'settingsTextList'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface ISettingsUrlFields {
  /** Key */
  key: string

  /** Value */
  value: string
}

export interface ISettingsUrl extends Entry<ISettingsUrlFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'settingsUrl'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export type CONTENT_TYPE =
  | 'contactCompany'
  | 'contactIndividual'
  | 'contactInstitution'
  | 'contentCode'
  | 'contentImage'
  | 'contentLink'
  | 'contentVideo'
  | 'cvEducation'
  | 'cvExperience'
  | 'cvSkill'
  | 'project'
  | 'projectAttribution'
  | 'settings'
  | 'settingsDecimal'
  | 'settingsInteger'
  | 'settingsRichText'
  | 'settingsText'
  | 'settingsTextList'
  | 'settingsUrl'

export type IEntry =
  | IContactCompany
  | IContactIndividual
  | IContactInstitution
  | IContentCode
  | IContentImage
  | IContentLink
  | IContentVideo
  | ICvEducation
  | ICvExperience
  | ICvSkill
  | IProject
  | IProjectAttribution
  | ISettings
  | ISettingsDecimal
  | ISettingsInteger
  | ISettingsRichText
  | ISettingsText
  | ISettingsTextList
  | ISettingsUrl

export type LOCALE_CODE = 'en-US'

export type CONTENTFUL_DEFAULT_LOCALE_CODE = 'en-US'
