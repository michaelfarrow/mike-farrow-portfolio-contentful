import { ISettingFields } from '@t/contentful'
import { getEntries } from '@/lib/contentful'
import { tag } from '@/lib/cache'

type SettingKey = ISettingFields['key']

type SettingPrefix = SettingKey extends `${infer Type}.${string}` ? Type : never
type SettingPrefixKeys<T extends SettingKey> = T extends `${string}.${infer Key}` ? Key : never

type SettingPrefixKeyMap = {
  [key in SettingPrefix]: SettingPrefixKeys<Extract<SettingKey, `${key}.${string}`>>
}

export async function getSettings(prefix?: SettingPrefix) {
  const settings = await getEntries(
    {
      content_type: 'setting',
      ...((prefix && { 'fields.key[match]': `^${prefix}` }) || {}),
    },
    (prefix && [tag('entries', { type: 'setting', prefix })]) || []
  )

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
  <
    P extends SettingPrefix | undefined,
    K = P extends SettingPrefix ? SettingPrefixKeyMap[P] : SettingKey
  >(
    settings: ISettingFields[],
    prefix?: P
  ) =>
  <T, D extends NonNullable<T>>(process: (v?: string | null) => T) => {
    function getSetting(key: K): T
    function getSetting(key: K, defaultValue: D): NonNullable<T>

    function getSetting(key: K, defaultValue?: any) {
      const val = process(get(settings)(String(prefix ? `${prefix}.${key}` : key)))
      return defaultValue !== undefined
        ? val !== null && val !== undefined
          ? val
          : defaultValue
        : val
    }

    return getSetting
  }

async function getMethods<P extends SettingPrefix | undefined>(prefix?: P) {
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
            .split(/\n/)
            .map((v) => v.trim())
            .filter((v) => v.length)) ||
        null
    ),
    // textArray: h(
    //   (v) =>
    //     (v &&
    //       v
    //         .split(/(?<=[^\\]|^);/)
    //         .map((v) => v.trim().replace(/\\;/g, ';'))
    //         .filter((v) => v.length)) ||
    //     null
    // ),
  }
}

function settings(): ReturnType<typeof getMethods<undefined>>
function settings<P extends SettingPrefix>(prefix: P): ReturnType<typeof getMethods<P>>

function settings(prefix?: any) {
  return getMethods(prefix)
}

export default settings
