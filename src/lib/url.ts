import { mapValues, pickBy } from 'lodash'

export function createUrl(base: string, params: { [key: string]: any } = {}) {
  const ambiguousProto = Boolean(base.match(/^\/\//))
  const filteredParams = pickBy(
    mapValues(params, (p) => p !== undefined && p !== null && String(p)),
    (p): p is string => !!p
  )

  const url = new URL(ambiguousProto ? `http:${base}` : base)
  url.search = new URLSearchParams(filteredParams).toString()
  const final = url.toString()

  return ambiguousProto ? final.replace(/^http:/, '') : final
}
