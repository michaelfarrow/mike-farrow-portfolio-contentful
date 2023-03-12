import { IContentCode } from '@t/contentful'
import GeneralCode from '@/components/general/code'
// import styles from '@/styles/components/content/video.module.css'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentCode
}

export default function Code({
  className,
  entry: {
    fields: { content, language },
  },
  ...rest
}: Props) {
  return <GeneralCode language={language} content={content} />
}
