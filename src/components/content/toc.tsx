import clsx from 'clsx'
import { Document, Block } from '@contentful/rich-text-types'

import { toText, slugGenerator } from '@/lib/document'

export type HeadingConfig = {
  block: Block
  children: HeadingConfig[]
}

export interface Props extends React.ComponentPropsWithoutRef<'ul'> {
  document: Document
}

export default function TOC({ className, document, ...rest }: Props) {
  const slug = slugGenerator()
  const headings: HeadingConfig[] = []

  function renderTocLevel(headings: HeadingConfig[], props?: React.ComponentPropsWithoutRef<'ul'>) {
    return (
      <ul {...props}>
        {headings.map((heading, i) => {
          const text = toText(heading.block)
          return (
            <li key={i}>
              <a href={`#${slug(text)}`}>{text}</a>
              {heading.children?.length ? renderTocLevel(heading.children) : undefined}
            </li>
          )
        })}
      </ul>
    )
  }

  document.content.forEach((block) => {
    if (block.nodeType.startsWith('heading-2')) {
      headings.push({ block, children: [] })
    } else if (block.nodeType.startsWith('heading-3')) {
      if (headings.length) {
        headings[headings.length - 1].children?.push({ block, children: [] })
      }
    }
  })

  return (
    (headings.length && renderTocLevel(headings, { className: clsx(className), ...rest })) || null
  )
}
