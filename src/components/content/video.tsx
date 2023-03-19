import { IContentVideo } from '@t/contentful'
import { default as GenericVideo, Props as GenericVideoProps } from '@/components/general/video'
import Picture from '@/components/content/picture'

export interface Props extends Omit<GenericVideoProps, 'src' | 'title' | 'width' | 'height'> {
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
  ...rest
}: Props) {
  return (
    <GenericVideo
      title={name}
      src={url}
      width={width}
      height={height}
      controls
      background={background}
      {...rest}
    >
      {poster && <Picture entry={poster} sizes={sizes} />}
    </GenericVideo>
  )
}
