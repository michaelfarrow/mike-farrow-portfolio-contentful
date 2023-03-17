import { IContentImage, IContentBreakpointImage } from '@t/contentful'
import {
  default as GenericPicture,
  Props as GenericPictureProps,
} from '@/components/general/picture'

export interface Props extends Omit<GenericPictureProps, 'images' | 'alt'> {
  entry: IContentImage
}

const BREAKPOINT_MAP: { [key in IContentBreakpointImage['fields']['max']]: number } = {
  Mobile: 800,
  Tablet: 1200,
}

export default function Picture({
  className,
  style,
  entry: {
    fields: { name, image, altImages, maxWidth },
  },
  sizes,
  ...rest
}: Props) {
  return (
    <GenericPicture
      alt={name}
      images={[
        ...(altImages || []).map(({ fields: { max, image } }) => ({
          max: BREAKPOINT_MAP[max],
          image,
        })),
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
