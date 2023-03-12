export interface Props extends Omit<React.ComponentPropsWithoutRef<'a'>, 'target' | 'rel'> {
  external?: boolean
}

export default function Link({ external = true, ...rest }: Props) {
  return (
    <a
      {...rest}
      target={(external && '_blank') || undefined}
      rel={(external && 'noopener noreferrer') || undefined}
    />
  )
}
