import { IContentVideo } from '@t/contentful'
import { default as GenericVideo } from '@/components/general/video'
import Picture from '@/components/content/picture'

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
      poster,
      background,
    },
  },
  sizes,
}: Props) {
  return (
    <GenericVideo
      title={name}
      src={url}
      width={width}
      height={height}
      controls={!background}
      background={background}
    >
      {poster && <Picture entry={poster} sizes={sizes} />}
    </GenericVideo>
  )
}
