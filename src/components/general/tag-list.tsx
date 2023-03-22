import clsx from 'clsx'

import Tag from '@/components/general/tag'
import styles from '@/styles/components/general/tag-list.module.scss'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  tags: string[]
}

export default function TagList({ className, tags, ...rest }: Props): JSX.Element {
  return (
    <div className={clsx(styles.wrapper, className)} {...rest}>
      <ul className={styles.list}>
        {tags.map((tag, i) => (
          <li key={`tag-${i}`}>
            <Tag className={styles.tag}>{tag}</Tag>
          </li>
        ))}
      </ul>
    </div>
  )
}
