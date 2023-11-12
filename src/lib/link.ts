export const OK_REGEX = /#ok$/

export function okLink(url: string) {
  return url.replace(OK_REGEX, '')
}
