import { Asset } from 'contentful'

import { default as GenericVideo, Props as GenericVideoProps } from '@/components/general/video'

export interface Props extends Omit<GenericVideoProps, 'src' | 'title'> {
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
  ...rest
}: Props) {
  return <GenericVideo title={title} src={url} controls {...rest} />
}
