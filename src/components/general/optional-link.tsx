import Link, { Props as LinkProps } from '@/components/general/link'
import { IContentLink } from '@t/contentful'

export interface Props extends Omit<LinkProps, 'children' | 'href'> {
  children?: string
  link?: IContentLink
}

export default function OptionalLink({ children, link, ...rest }: Props) {
  return link ? (
    <Link href={link.fields.url} {...rest}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )
}
