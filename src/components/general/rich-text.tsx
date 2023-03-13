import { HTMLAttributes, ReactNode } from 'react'
import { Entry, Asset } from 'contentful'
import { Document as ContentfulDocument, BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import {
  documentToReactComponents,
  Options,
  NodeRenderer,
} from '@contentful/rich-text-react-renderer'

import { CONTENT_TYPE, IEntry } from '@t/contentful'
import Link from '@/components/general/link'
import EntryLink from '@/components/general/entry-link'

import styles from '@/styles/components/general/rich-text.module.css'

// import merge from 'merge-options';

export type Document = ContentfulDocument

export interface RichTextProps {
  children: Document
}

// export interface RichTextEntry<T extends Entry<any>, K = T['fields']> extends Entry<K> {
//   sys: {
//     id: string
//     type: string
//     createdAt: string
//     updatedAt: string
//     locale: string
//     contentType: {
//       sys: {
//         id: string
//         linkType: 'ContentType'
//         type: 'Link'
//       }
//     }
//   }
// }

// export type EntryRenderProps<T extends Entry<any>> = {
//   entry: RichTextEntry<T>
// }

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

function childrenArray(children: ReactNode): ReactNode[] {
  return Array.isArray(children) ? children || [] : [children]
}

// const findP = (el?: React.ReactElement) => {
//   if (!el) return undefined
//   let p: React.ReactElement | undefined
//   if (el.props && el.props.children) {
//     const children = !Array.isArray(el.props.children) ? [el.props.children] : el.props.children
//     children.forEach((child: any) => {
//       if (child.type === 'p' && !p) {
//         p = child
//       } else {
//         const childP = findP(child)
//         if (childP && !p) {
//           p = childP
//         }
//       }
//     })
//   }
//   console.log('ere')
//   return p
// }

// function merge<T>(o: T, extend: T) {
//   return o
// }

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
  if (typeof firstChild === 'object' && firstChild.type === type && _children.length === 1) {
    return firstChild?.props?.children || children
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
}: // options: extendOptions,
Props) {
  function blockProps(type?: string) {
    return (mappedBlockProps as any)?.[type || ''] || {}
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
      [BLOCKS.HEADING_1]: ({}, children) => <h1 {...blockProps(BLOCKS.HEADING_1)}>{children}</h1>,
      [BLOCKS.HEADING_2]: ({}, children) => <h2 {...blockProps(BLOCKS.HEADING_2)}>{children}</h2>,
      [BLOCKS.HEADING_3]: ({}, children) => <h3 {...blockProps(BLOCKS.HEADING_3)}>{children}</h3>,
      [BLOCKS.HEADING_4]: ({}, children) => <h4 {...blockProps(BLOCKS.HEADING_4)}>{children}</h4>,
      [BLOCKS.HEADING_5]: ({}, children) => <h5 {...blockProps(BLOCKS.HEADING_5)}>{children}</h5>,
      [BLOCKS.HEADING_6]: ({}, children) => <h6 {...blockProps(BLOCKS.HEADING_6)}>{children}</h6>,
      [BLOCKS.HR]: () => <hr {...blockProps(BLOCKS.HR)} />,
      [BLOCKS.PARAGRAPH]: ({}, children) =>
        (childrenArray(childrenArray(children)).join('').length && <p>{children}</p>) || null,
    },
  }
  return <>{documentToReactComponents(children, options)}</>
}
