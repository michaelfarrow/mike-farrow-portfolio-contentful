import clsx from 'clsx'
import { Document as ContentfulDocument } from '@contentful/rich-text-types'

import RichText from '@/components/general/rich-text'

import Columns from '@/components/content/columns'
import Image, { Props as ImageProps } from '@/components/content/image'
import ImageCompare, { Props as ImageCompareProps } from '@/components/content/image-compare'
import AssetImage from '@/components/content/asset-image'
import Video, { Props as VideoProps } from '@/components/content/video'
import VideoEmbed, { Props as VideoEmbedProps } from '@/components/content/video-embed'
import AssetVideo from '@/components/content/asset-video'

import Code from '@/components/content/code'

import typography from '@/styles/typography.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  document: ContentfulDocument
  sizes?: string
}

export default function PageRichText({ className, document, sizes, ...rest }: Props) {
  const ImageWithSizes = (props: ImageProps) => <Image {...props} sizes={sizes} />
  const ImageCompareWithSizes = (props: ImageCompareProps) => (
    <ImageCompare {...props} sizes={sizes} />
  )
  const VideoWithSizes = (props: VideoProps) => <Video {...props} sizes={sizes} />
  const VideoEmbedWithSizes = (props: VideoEmbedProps) => <VideoEmbed {...props} sizes={sizes} />

  return (
    <div className={clsx(typography.textLinks, className)} {...rest}>
      <RichText
        blockEmbeddedEntry={{
          contentColumns: Columns,
          contentVideo: VideoWithSizes,
          contentVideoEmbed: VideoEmbedWithSizes,
          contentImage: ImageWithSizes,
          contentImageCompare: ImageCompareWithSizes,
          contentCode: Code,
        }}
        blockEmbeddedAsset={(asset, type) => {
          if (type.startsWith('image/')) {
            return <AssetImage asset={asset} sizes={sizes} />
          }
          if (type.startsWith('video/')) {
            return <AssetVideo asset={asset} sizes={sizes} />
          }
        }}
      >
        {document}
      </RichText>
    </div>
  )
}
