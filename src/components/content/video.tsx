import { IContentVideo } from '@t/contentful'
import { default as GenericVideo } from '@/components/general/video'

export interface Props {
  entry: IContentVideo
  sizes?: string
}

export default function Video({
  entry: {
    fields: {
      name,
      video: {
        fields: {
          file: { url },
        },
      },
      width,
      height,
    },
  },
  sizes,
}: Props) {
  return <GenericVideo title={name} src={url} sizes={sizes} width={width} height={height} />
}
