import { Asset } from 'contentful'

import Picture, { Props as PictureProps } from '@/components/general/picture'

export interface Props extends Omit<PictureProps, 'alt' | 'images'> {
  asset: Asset
}

export default function AssetImage({
  asset,
  asset: {
    fields: { title },
  },
  ...rest
}: Props) {
  return (
    <Picture
      {...rest}
      alt={title}
      images={[
        {
          image: asset,
        },
      ]}
    />
  )
}
