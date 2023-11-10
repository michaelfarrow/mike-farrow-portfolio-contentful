import Link, { Props as LinkProps } from '@/components/general/link'
import { IContentLink } from '@t/contentful'
import { okLink } from '@/lib/link'

export interface Props extends Omit<LinkProps, 'children' | 'href'> {
  children?: string
  link?: IContentLink
}

export default function OptionalLink({ children, link, ...rest }: Props) {
  return link ? (
    <Link href={okLink(link.fields.url)} {...rest}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )
}
