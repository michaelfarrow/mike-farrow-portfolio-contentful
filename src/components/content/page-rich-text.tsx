import clsx from 'clsx'
import { Document as ContentfulDocument } from '@contentful/rich-text-types'

import RichText from '@/components/general/rich-text'

import Columns, { Props as ColumnsProps } from '@/components/content/columns'
import Image, { Props as ImageProps } from '@/components/content/image'
import ImageCompare, { Props as ImageCompareProps } from '@/components/content/image-compare'
import AssetImage from '@/components/content/asset-image'
import Video, { Props as VideoProps } from '@/components/content/video'
import VideoEmbed, { Props as VideoEmbedProps } from '@/components/content/video-embed'
import AssetVideo from '@/components/content/asset-video'
import Code, { Props as CodeProps } from '@/components/content/code'

export interface Props {
  document: ContentfulDocument
  sizes?: string
  styles?: any
}

export default function PageRichText({ document, sizes, styles, ...rest }: Props) {
  const _Columns = (props: ColumnsProps) => (
    <Columns className={styles.columns} {...props} styles={styles} />
  )

  const _Image = (props: ImageProps) => {
    const image = <Image className={styles.image} {...props} sizes={sizes} />
    if (props.entry.fields.maxWidth) {
      return <div className={styles.imageMaxWidth}>{image}</div>
    }
    return image
  }
  const _ImageCompare = (props: ImageCompareProps) => (
    <ImageCompare className={styles.imageCompare} {...props} sizes={sizes} />
  )
  const _Video = (props: VideoProps) => <Video className={styles.video} {...props} sizes={sizes} />
  const _VideoEmbed = (props: VideoEmbedProps) => (
    <VideoEmbed className={styles.videoEmbed} {...props} sizes={sizes} />
  )
  const _Code = (props: CodeProps) => <Code className={styles.code} {...props} />

  return (
    <RichText
      blockEmbeddedEntry={{
        contentColumns: _Columns,
        contentVideo: _Video,
        contentVideoEmbed: _VideoEmbed,
        contentImage: _Image,
        contentImageCompare: _ImageCompare,
        contentCode: _Code,
      }}
      blockEmbeddedAsset={(asset, type) => {
        if (type.startsWith('image/')) {
          return <AssetImage className={styles.assetImage} asset={asset} sizes={sizes} />
        }
        if (type.startsWith('video/')) {
          return <AssetVideo className={styles.assetVideo} asset={asset} sizes={sizes} />
        }
      }}
      styles={styles}
    >
      {document}
    </RichText>
  )
}
