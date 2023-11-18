import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { urlForEntrySlug } from '@/lib/entry'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()

  const type = searchParams.get('type')
  const slug = searchParams.get('slug')
  const url = type && slug && urlForEntrySlug(type as any, slug)

  redirect(url || '/')
}
