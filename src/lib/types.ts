export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type NonNullableObject<T, K extends keyof T = keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P]
}
