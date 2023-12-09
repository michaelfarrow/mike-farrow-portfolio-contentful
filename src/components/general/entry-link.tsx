import { default as NextLink, LinkProps } from 'next/link'
import { IEntry } from '@t/contentful'

import { isContentType } from '@/lib/contentful'
import { urlForEntry } from '@/lib/entry'
import { okLink } from '@/lib/link'

import Link from '@/components/general/link'

export interface Props extends Omit<LinkProps, 'href'> {
  className?: string
  children?: React.ReactNode
  entry: IEntry
}

export default function EntryLink({ className, entry, children, ...rest }: Props) {
  if (isContentType(entry, 'contentLink')) {
    return (
      <Link {...rest} className={className} href={okLink(entry.fields.url)}>
        {children}
      </Link>
    )
  }

  const url = urlForEntry(entry)

  if (!url) return <a className={className}>Link type {entry.sys.contentType.sys.id} not found</a>

  return (
    <NextLink prefetch={false} {...rest} className={className} href={url} /* scroll={false} */>
      {children}
    </NextLink>
  )
}
