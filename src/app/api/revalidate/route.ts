import { revalidatePath, revalidateTag } from 'next/cache'
import { tag } from '@/lib/cache'

function revalidate(...tags: string[]) {
  for (const tag of tags) {
    console.log(`Revalidating "${tag}"`)
    revalidateTag(tag)
  }
}

export async function POST(request: Request) {
  const secret = request.headers.get('X-Contentful-Secret')
  const topic = request.headers.get('X-Contentful-Topic')
  const body = await request.json()

  // if (process.env.NODE_ENV !== 'development' && secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
  //   return new Response('Invalid token', { status: 401 })
  // }

  // if (topic?.startsWith('ContentManagement.Asset')) {
  //   const id = body?.sys?.id
  //   id && revalidate(tag('asset', { id }))
  //   revalidate('assets')
  // }

  // if (topic?.startsWith('ContentManagement.Entry')) {
  //   const type = body?.sys?.contentType?.sys?.id
  //   const slug = body?.fields?.slug?.['en-US']

  //   type && slug && revalidate(tag('entry', { type, slug }))
  //   type && revalidate(tag('entries', { type }))
  // }

  revalidate('entry')
  revalidate('entries')
  revalidatePath('/projects/bluetooth-typewriter')

  return Response.json({ ok: true })
}
