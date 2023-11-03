import { CONTENT_TYPE } from '@t/contentful'
import { Entry } from 'contentful'
import Link, { LinkProps } from 'next/link'

export interface Props extends Omit<LinkProps, 'href'> {
  className?: string
  children?: React.ReactNode
  entry: Entry<any>
}

export type LinkType = {
  path?: string
  key: string
}

export type LinkTypes = {
  [key in CONTENT_TYPE]?: LinkType
}

const types: LinkTypes = {
  project: {
    path: 'projects',
    key: 'slug',
  },
}

export default function EntryLink({ className, entry, children, ...rest }: Props) {
  const _type = entry.sys.contentType.sys.id
  const type = types[_type as CONTENT_TYPE]
  if (!type) return <a className={className}>Link type {_type} not found</a>
  const path = (type.path && `${type.path}/`) || ''
  return (
    <Link
      {...rest}
      className={className}
      href={`/${path}${encodeURIComponent(entry.fields[type.key])}`} /* scroll={false} */
    >
      {children}
    </Link>
  )
}
