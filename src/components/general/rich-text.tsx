import { HTMLAttributes, ReactNode } from 'react'
import { Entry, Asset } from 'contentful'
import {
  Document as ContentfulDocument,
  Block,
  Inline,
  BLOCKS,
  INLINES,
  MARKS,
} from '@contentful/rich-text-types'
import {
  documentToReactComponents,
  Options,
  NodeRenderer,
} from '@contentful/rich-text-react-renderer'

import { CONTENT_TYPE, IEntry } from '@t/contentful'
import { toText, slugGenerator } from '@/lib/document'
import Link from '@/components/general/link'
import EntryLink from '@/components/general/entry-link'

import styles from '@/styles/components/general/rich-text.module.css'

export type Document = ContentfulDocument

export interface RichTextProps {
  children: Document
}

export type EntryHandlers = {
  [Entry in IEntry as Entry['sys']['contentType']['sys']['id']]?: React.ComponentType<{
    entry: Entry
    children?: ReactNode
  }>
}

export interface Props {
  children: Document
  inlineHyperlink?: (url: string, children: ReactNode) => ReactNode
  inlineEntryHyperlink?: EntryHandlers
  inlineAssetHyperlink?: (asset: Asset, contentType: string, children: ReactNode) => ReactNode
  inlineEmbeddedEntry?: EntryHandlers
  blockEmbeddedEntry?: EntryHandlers
  blockEmbeddedAsset?: (asset: Asset, contentType: string) => ReactNode
  options?: Options
  blockProps?: { [key in BLOCKS]?: HTMLAttributes<any> }
}

function getType(node: any): CONTENT_TYPE | null {
  return node?.data?.target?.sys?.contentType?.sys?.id || undefined
}

function getContentType(node: any): string | null {
  return node?.data?.target?.fields?.file?.contentType || ''
}

type EntryHandler = (entry: Entry<any>, type: CONTENT_TYPE | null, children: ReactNode) => ReactNode

function handleEntry<T extends EntryHandler>(handler: T) {
  const h: NodeRenderer = (node, children) => {
    if (node.data.target.fields) return handler(node.data.target, getType(node), children)
  }
  return h
}

type AssetHandler = (asset: Asset, contentType: string | null, children: ReactNode) => ReactNode

function handleAsset<T extends AssetHandler>(handler: T) {
  const h: NodeRenderer = (node, children) => {
    if (node.data.target.fields?.file)
      return handler(node.data.target, getContentType(node), children)
  }
  return h
}

type NodeHandler = (node: Block | Inline, children: ReactNode) => ReactNode

function childrenArray(children: ReactNode): ReactNode[] {
  return Array.isArray(children) ? children || [] : [children]
}

function EntryComponent({
  handlers,
  children,
  type,
  entry,
}: {
  handlers: EntryHandlers
  children?: ReactNode
  type: CONTENT_TYPE
  entry: Entry<any>
}) {
  const Component: any = handlers[type]
  if (!Component) return null
  return <Component entry={entry}>{children}</Component>
}

function Missing({ children }: { children: string | null }) {
  if (!children) return null
  return <span style={{ display: 'none' }}>Missing handler for: {children}</span>
}

function unwrap(children: ReactNode, type: string): ReactNode {
  const _children: any[] = Array.isArray(children) ? children : children ? [children] : []
  if (!_children.length) return null
  const firstChild = _children[0]

  if (
    typeof firstChild === 'object' &&
    firstChild.type === type &&
    (_children.length === 1 || !Array.isArray(_children))
  ) {
    const _children = firstChild?.props?.children
    return _children !== undefined ? _children : children
  }
  return children
}

export default function RichText({
  children,
  inlineHyperlink,
  inlineEntryHyperlink,
  inlineAssetHyperlink,
  inlineEmbeddedEntry,
  blockEmbeddedEntry,
  blockEmbeddedAsset,
  blockProps: mappedBlockProps,
}: Props) {
  const slug = slugGenerator()

  function blockProps(type?: string) {
    return (mappedBlockProps as any)?.[type || ''] || {}
  }

  function handleHeading(Heading: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', props?: any) {
    const handler: NodeHandler = (node, children) => {
      return (
        <Heading id={slug(toText(node))} {...props}>
          {children}
        </Heading>
      )
    }
    return handler
  }

  const options: Options = {
    renderText: (text) => <span>{text}</span>,
    renderMark: {
      [MARKS.CODE]: (children) => <span className={styles.code}>{children}</span>,
    },
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => {
        return (
          (inlineHyperlink && inlineHyperlink(node.data.uri, children)) || (
            <Link href={node.data.uri}>{children}</Link>
          )
        )
      },
      [INLINES.ENTRY_HYPERLINK]: handleEntry((entry, type, children) => {
        if (inlineEntryHyperlink && type && inlineEntryHyperlink[type]) {
          return (
            <EntryComponent entry={entry} type={type} handlers={inlineEntryHyperlink}>
              {children}
            </EntryComponent>
          )
        }
        return <EntryLink entry={entry}>{children}</EntryLink>
      }),
      [INLINES.ASSET_HYPERLINK]: handleAsset(
        (asset, contentType, children) =>
          (inlineAssetHyperlink &&
            contentType &&
            inlineAssetHyperlink(asset, contentType, children)) || (
            <Link href={asset.fields.file.url}>{children}</Link>
          )
      ),
      [INLINES.EMBEDDED_ENTRY]: handleEntry((entry, type) => {
        if (inlineEmbeddedEntry && type && inlineEmbeddedEntry[type]) {
          return <EntryComponent entry={entry} type={type} handlers={inlineEmbeddedEntry} />
        }
        return <Missing>{type}</Missing>
      }),
      [BLOCKS.EMBEDDED_ENTRY]: handleEntry((entry, type) => {
        if (blockEmbeddedEntry && type && blockEmbeddedEntry[type]) {
          return <EntryComponent entry={entry} type={type} handlers={blockEmbeddedEntry} />
        }
        return <Missing>{type}</Missing>
      }),
      [BLOCKS.EMBEDDED_ASSET]: handleAsset(
        (asset, contentType) =>
          (blockEmbeddedAsset && contentType && blockEmbeddedAsset(asset, contentType)) || null
      ),
      [BLOCKS.OL_LIST]: ({}, children) => <ol {...blockProps(BLOCKS.OL_LIST)}>{children}</ol>,
      [BLOCKS.UL_LIST]: ({}, children) => <ul {...blockProps(BLOCKS.UL_LIST)}>{children}</ul>,
      [BLOCKS.LIST_ITEM]: ({}, children) => {
        return <li>{unwrap(children, 'p')}</li>
      },
      [BLOCKS.HEADING_1]: handleHeading('h1', blockProps(BLOCKS.HEADING_1)),
      [BLOCKS.HEADING_2]: handleHeading('h2', blockProps(BLOCKS.HEADING_2)),
      [BLOCKS.HEADING_3]: handleHeading('h3', blockProps(BLOCKS.HEADING_3)),
      [BLOCKS.HEADING_4]: handleHeading('h1', blockProps(BLOCKS.HEADING_4)),
      [BLOCKS.HEADING_5]: handleHeading('h5', blockProps(BLOCKS.HEADING_5)),
      [BLOCKS.HEADING_6]: handleHeading('h6', blockProps(BLOCKS.HEADING_6)),
      [BLOCKS.HR]: () => <hr {...blockProps(BLOCKS.HR)} />,
      [BLOCKS.PARAGRAPH]: ({}, children) => {
        const _children = childrenArray(children)
        const firstChild = _children[0]
        const firstChildUnwrapped = firstChild && unwrap(firstChild, 'span')

        if (
          _children.length === 1 &&
          typeof firstChildUnwrapped === 'string' &&
          !firstChildUnwrapped.trim().length
        )
          return null

        return <p>{children}</p>
      },
    },
  }
  return <>{documentToReactComponents(children, options)}</>
}
