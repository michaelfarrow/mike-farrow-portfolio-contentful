import { Asset } from 'contentful'

import Picture, { Props as PictureProps } from '@/components/general/picture'

export interface Props extends Omit<PictureProps, 'alt' | 'images'> {
  asset: Asset
  sizes?: string
}

export default function AssetImage({
  asset,
  asset: {
    fields: { title },
  },
  sizes,
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
      sizes={sizes}
    />
  )
}
