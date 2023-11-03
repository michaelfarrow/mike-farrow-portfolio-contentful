import { ISettingFields } from '@t/contentful'
import { getEntries } from '@/lib/contentful'

const get = (settings: ISettingFields[]) => (key: string) => {
  if (!settings) return null
  const setting = settings.find((setting) => setting.key === key)
  if (!setting) return null
  return setting.value !== undefined ? setting.value : undefined
}

const createHelper =
  (settings: ISettingFields[]) =>
  <T, D extends NonNullable<T>>(process: (v?: string | null) => T) => {
    function getSetting(key: string): T
    function getSetting(key: string, defaultValue: D): NonNullable<T>

    function getSetting(key: string, defaultValue?: any) {
      const val = process(get(settings)(key))
      return defaultValue !== undefined
        ? val !== null && val !== undefined
          ? val
          : defaultValue
        : val
    }

    return getSetting
  }

export default function wrap(settings: ISettingFields[]) {
  const h = createHelper(settings)

  return {
    text: h((v) => v || null),
    number: h((v) => {
      if (v) {
        const n = Number(v)
        if (!isNaN(n)) return n
      }
      return null
    }),
    bool: h((v) => v !== null),
    textArray: h(
      (v) =>
        (v &&
          v
            .split(/(?<=[^\\]|^);/)
            .map((v) => v.trim().replace(/\\;/g, ';'))
            .filter((v) => v.length)) ||
        null
    ),
  }
}

export async function getSettings(prefix?: string) {
  const settings = await getEntries({
    content_type: 'setting',
    ...((prefix && { 'fields.key[match]': `^${prefix}` }) || {}),
  })
  return settings.map((setting) => setting.fields)
}
