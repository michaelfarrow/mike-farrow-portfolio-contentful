import clsx from 'clsx'

import { ICvEducation } from '@t/contentful'

import { DateRange } from '@/components/general/date-time'
import OptionalLink from '@/components/general/optional-link'

import styles from '@/styles/components/cv/education.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'ul'> {
  entries: ICvEducation[]
}

export default function Education({ className, entries, ...rest }: Props) {
  return (
    <ul {...rest} className={clsx(styles.list, className)}>
      {entries.map(
        (
          {
            fields: {
              qualification,
              institution: {
                fields: { link, name: institution },
              },
              from,
              to,
            },
          },
          i
        ) => (
          <li key={i} className={styles.listItem}>
            <h3 className={styles.date}>
              <DateRange from={from} to={to} hideMonth />
            </h3>
            <p className={styles.qualification}>{qualification}</p>
            <p className={styles.institution}>
              <OptionalLink link={link}>{institution}</OptionalLink>
            </p>
          </li>
        )
      )}
    </ul>
  )
}
