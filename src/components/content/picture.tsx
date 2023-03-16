import { orderBy } from 'lodash'

import { IContentImage, IContentBreakpointImage } from '@t/contentful'
import {
  default as GeneralPicture,
  Props as GenericPictureProps,
} from '@/components/general/picture'

export interface Props extends Omit<GenericPictureProps, 'images' | 'alt'> {
  entry: IContentImage
}

const BREAKPOINT_MAP: { [key in IContentBreakpointImage['fields']['max']]: number } = {
  Mobile: 800,
  Tablet: 1200,
}

export default function Image({
  className,
  style,
  entry: {
    fields: { name, image, altImages, maxWidth },
  },
  sizes,
  ...rest
}: Props) {
  return (
    <GeneralPicture
      alt={name}
      images={[
        ...orderBy(
          (altImages || []).map(({ fields: { max, image } }) => ({
            max: BREAKPOINT_MAP[max],
            image,
          })),
          'max'
        ),
        {
          image,
        },
      ]}
      maxWidth={maxWidth}
      sizes={maxWidth ? undefined : sizes}
      {...rest}
    />
  )
}
