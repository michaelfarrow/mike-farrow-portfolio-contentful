import { Block, Inline } from '@contentful/rich-text-types'
import { paramCase } from 'change-case'

export function toText(node: Block | Inline): string {
  return node.content
    .map((childNode) => {
      if (childNode.nodeType === 'text') return childNode.value
      return toText(childNode)
    })
    .join('')
}

export function slugGenerator() {
  const slugs: string[] = []

  return (text: string) => {
    let slug = paramCase(text)
    let i = 1
    while (slugs.includes(slug)) {
      slug = `${slug}-${i}`
      i++
    }
    slugs.push(slug)
    return slug
  }
}
