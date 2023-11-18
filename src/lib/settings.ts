import { ISettingFields } from '@t/contentful'
import { getEntries } from '@/lib/contentful'

type SettingKey = ISettingFields['key']

type SettingPrefix = SettingKey extends `${infer Type}.${string}` ? Type : never
type SettingPrefixKeys<T extends SettingKey> = T extends `${string}.${infer Key}` ? Key : never

type SettingPrefixKeyMap = {
  [key in SettingPrefix]: SettingPrefixKeys<Extract<SettingKey, `${key}.${string}`>>
}

export async function getSettings(prefix?: SettingPrefix) {
  const settings = await getEntries({
    content_type: 'setting',
    ...((prefix && { 'fields.key[match]': `^${prefix}` }) || {}),
  })

  const mapped = settings.map((setting) => setting.fields)
  return mapped
}

const get = (settings: ISettingFields[]) => (key: string) => {
  if (!settings) return null
  const setting = settings.find((setting) => setting.key === key)
  if (!setting) return null
  return setting.value !== undefined ? setting.value : undefined
}

const createHelper =
  <P extends SettingPrefix, K = SettingPrefixKeyMap[P]>(settings: ISettingFields[], prefix: P) =>
  <T, D extends NonNullable<T>>(process: (v?: string | null) => T) => {
    function getSetting(key: K): T
    function getSetting(key: K, defaultValue: D): NonNullable<T>

    function getSetting(key: K, defaultValue?: any) {
      const val = process(get(settings)(`${prefix}.${key}`))
      return defaultValue !== undefined
        ? val !== null && val !== undefined
          ? val
          : defaultValue
        : val
    }

    return getSetting
  }

export default async function settings<P extends SettingPrefix>(prefix: P) {
  const settings = await getSettings(prefix)
  const h = createHelper(settings, prefix)

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
