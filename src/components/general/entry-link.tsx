import { default as NextLink, LinkProps } from 'next/link'
import { CONTENT_TYPE, IEntry } from '@t/contentful'

import { ContentType, isContentType } from '@/lib/contentful'
import { okLink } from '@/lib/link'

import Link from '@/components/general/link'

export interface Props extends Omit<LinkProps, 'href'> {
  className?: string
  children?: React.ReactNode
  entry: IEntry
}

export type LinkType<T extends CONTENT_TYPE> = {
  path?: string
  key: keyof ContentType<T>['fields']
}

export type LinkTypes = {
  [key in CONTENT_TYPE]?: LinkType<key>
}

const types: LinkTypes = {
  project: {
    path: 'projects',
    key: 'slug',
  },
  photoAlbum: {
    path: 'albums',
    key: 'slug',
  },
}

export default function EntryLink({ className, entry, children, ...rest }: Props) {
  const _type = entry.sys.contentType.sys.id

  if (isContentType(entry, 'contentLink')) {
    return (
      <Link {...rest} className={className} href={okLink(entry.fields.url)}>
        {children}
      </Link>
    )
  }

  const type = types[_type]
  if (!type) return <a className={className}>Link type {_type} not found</a>
  const path = (type.path && `${type.path}/`) || ''

  return (
    <NextLink
      {...rest}
      className={className}
      href={`/${path}${encodeURIComponent((entry.fields as any)[type.key])}`} /* scroll={false} */
    >
      {children}
    </NextLink>
  )
}
