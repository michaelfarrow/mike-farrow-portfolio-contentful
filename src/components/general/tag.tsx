import clsx from 'clsx'

import styles from '@/styles/components/general/tag.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'span'> {
  children?: string
}

export default function Tag({ className, children, ...rest }: Props): JSX.Element {
  return (
    <span className={clsx(styles.tag, className)} {...rest}>
      {children}
    </span>
  )
  // title={children}
}
