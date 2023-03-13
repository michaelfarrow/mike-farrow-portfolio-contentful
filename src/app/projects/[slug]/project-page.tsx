import clsx from 'clsx'

import getData from './data'

import { NonNullableObject } from '@/lib/types'
import RichText from '@/components/general/rich-text'
import Attributions from '@/components/project/attributions'
import Picture from '@/components/general/picture'
import Video from '@/components/content/video'
import Image from '@/components/content/image'
import Code from '@/components/content/code'
import typography from '@/styles/typography.module.css'

export interface Props extends NonNullableObject<Awaited<ReturnType<typeof getData>>> {}

export default function ProjectPage({
  project: {
    fields: { name, content, attributions },
  },
}: Props) {
  return (
    <>
      <h2 className={clsx(typography.h, typography.h2)}>{name}</h2>

      <div className={typography.textLinks}>
        <RichText
          blockEmbeddedEntry={{
            contentVideo: Video,
            contentImage: Image,
            contentCode: Code,
          }}
          blockEmbeddedAsset={(asset, type) => {
            if (type.startsWith('image/')) {
              return <Picture alt={asset.fields.title} images={[{ image: asset }]} />
            }
          }}
          // blockProps={{ paragraph: { className: typography.textLinks } }}
        >
          {content}
        </RichText>
      </div>
      {attributions?.length ? <Attributions entries={attributions} /> : null}
    </>
  )
}
