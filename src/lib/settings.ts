import { Entry } from 'contentful'

import { ArrayElement } from '@/lib/types'
import { ISettings } from '@t/contentful'

type SettingContentType = ArrayElement<NonNullable<ISettings['fields']['items']>>
type SettingType = SettingContentType['sys']['contentType']['sys']['id']

type Setting<P extends SettingType, T = SettingContentType> = T extends Entry<any> & {
  sys: { contentType: { sys: { id: P } } }
}
  ? T['fields']['value']
  : never

const get =
  (settings: ISettings | null) =>
  <T extends SettingType>(type: T, key: string): Setting<T> | null => {
    if (!settings) return null
    const _key = `${settings.fields.key}.${key}`
    const setting = settings.fields.items?.find(
      (item) => item.sys.contentType.sys.id === type && _key === item.fields.key
    )
    return (setting?.fields.value !== undefined ? setting?.fields.value : null) as any
  }

const createHelper =
  (settings: ISettings | null) =>
  <T extends SettingType>(type: T) =>
  (key: string) =>
    get(settings)(type, key)

export default function wrap(settings: ISettings | null) {
  const h = createHelper(settings)

  return {
    get: get(settings),
    text: h('settingsText'),
    integer: h('settingsInteger'),
    decimal: h('settingsDecimal'),
    richText: h('settingsRichText'),
    textList: h('settingsTextList'),
    url: h('settingsUrl'),
  }
}
