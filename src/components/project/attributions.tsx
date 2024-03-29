import { Fragment } from 'react'
import clsx from 'clsx'

import { IProjectAttribution } from '@t/contentful'
import OptionalLink from '@/components/general/optional-link'
import typography from '@/styles/typography.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'ul'> {
  entries: IProjectAttribution[]
}

export default function Attributions({ className, entries, ...rest }: Props) {
  return (
    <ul {...rest} className={clsx(typography.textLinks, className)}>
      {entries.map(({ fields: { shortName, attributions } }, i) => (
        <li key={i}>
          {shortName} -{' '}
          {attributions.map(({ fields: { name, link } }, i) => (
            <Fragment key={i}>
              {i !== 0 ? ', ' : null}
              <OptionalLink key={i} link={link}>
                {name}
              </OptionalLink>
            </Fragment>
          ))}
        </li>
      ))}
    </ul>
  )
}
