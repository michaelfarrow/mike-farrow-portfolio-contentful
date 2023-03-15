import { IContentCode } from '@t/contentful'
import GeneralCode, { Language } from '@/components/general/code'

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  entry: IContentCode
}

const languageMap: { [key in IContentCode['fields']['language']]: Language } = {
  'Arduino C++': 'arduino',
  'C': 'c',
  'C#': 'csharp',
  'C++': 'cpp',
  'CSS': 'css',
  'HTML': 'markup',
  'JavaScript': 'jsx',
  'JSON': 'json',
  'SCSS': 'scss',
  'Shell': 'bash',
  'Shell Session': 'shellSession',
  'TypeScript': 'tsx',
}

export default function Code({
  className,
  entry: {
    fields: { content, language, filename, hideCopy },
  },
  ...rest
}: Props) {
  return (
    <div {...rest}>
      <GeneralCode
        language={languageMap[language]}
        content={content}
        filename={filename}
        hideCopy={hideCopy}
      />
    </div>
  )
}
