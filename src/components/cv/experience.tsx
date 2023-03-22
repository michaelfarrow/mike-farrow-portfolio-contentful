import clsx from 'clsx'

import { ICvExperience } from '@t/contentful'

import { DateRange } from '@/components/general/date-time'
import RichText from '@/components/general/rich-text'
import OptionalLink from '@/components/general/optional-link'

import styles from '@/styles/components/cv/experience.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'ul'> {
  entries: ICvExperience[]
}

export default function Experience({ className, entries, ...rest }: Props) {
  return (
    <ul {...rest} className={clsx(styles.list, className)}>
      {entries.map(
        (
          {
            fields: {
              title,
              from,
              to,
              description,
              employer: {
                fields: { link, name: employer },
              },
            },
          },
          i
        ) => {
          return (
            <li key={i} className={styles.listItem}>
              <h3 className={styles.date}>
                <DateRange from={from} to={to} monthFormat="MMMM" showDuration />
              </h3>
              <span className={styles.role}>
                <p>{title}</p>
                <p>
                  <OptionalLink link={link}>{employer}</OptionalLink>
                </p>
              </span>
              <span className={styles.description}>
                <RichText>{description}</RichText>
              </span>
            </li>
          )
        }
      )}
    </ul>
  )
}
