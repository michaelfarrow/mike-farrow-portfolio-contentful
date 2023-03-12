import clsx from 'clsx'

import { ICvSkill } from '@t/contentful'
import styles from '@/styles/components/cv/skills.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'ul'> {
  entries: ICvSkill[]
}

export default function Skills({ className, entries, ...rest }: Props) {
  return (
    <ul {...rest} className={clsx(styles.list, className)}>
      {entries.map(({ fields: { name, subSkills } }, i) => (
        <li key={i} className={styles.listItem}>
          {name}
          {(subSkills?.length && <Skills entries={subSkills} />) || null}
        </li>
      ))}
    </ul>
  )
}
