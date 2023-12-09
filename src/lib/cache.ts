import { paramCase } from 'change-case'

export function tag(
  type: string,
  attrs: { [key: string]: string | number | false | undefined | null } = {}
) {
  return [
    type,
    ...Object.keys(attrs)
      .sort()
      .map((key) => {
        const val = attrs[key]
        return ![false, undefined, null].includes(val as any) && `${paramCase(key)}_${String(val)}`
      }),
  ]
    .filter((part) => !!part)
    .join('__')
}
