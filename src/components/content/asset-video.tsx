import { Asset } from 'contentful'
import { default as GenericVideo } from '@/components/general/video'

export interface Props {
  asset: Asset
  sizes?: string
}

export default function Video({
  asset: {
    fields: {
      title,
      file: { url },
    },
  },
  sizes,
}: Props) {
  return <GenericVideo title={title} src={url} sizes={sizes} />
}
