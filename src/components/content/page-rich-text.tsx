import clsx from 'clsx'
import { Document as ContentfulDocument } from '@contentful/rich-text-types'

import RichText from '@/components/general/rich-text'

import AssetImage from '@/components/content/asset-image'
import Columns from '@/components/content/columns'
import Video from '@/components/content/video'
import Image, { Props as ImageProps } from '@/components/content/image'
import ImageCompare, { Props as ImageCompareProps } from '@/components/content/image-compare'
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

  return (
    <div className={clsx(typography.textLinks, className)} {...rest}>
      <RichText
        blockEmbeddedEntry={{
          contentColumns: Columns,
          contentVideo: Video,
          contentImage: ImageWithSizes,
          contentImageCompare: ImageCompareWithSizes,
          contentCode: Code,
        }}
        blockEmbeddedAsset={(asset, type) => {
          if (type.startsWith('image/')) {
            return <AssetImage asset={asset} sizes={sizes} />
          }
        }}
      >
        {document}
      </RichText>
    </div>
  )
}
