import { get as _get } from 'lodash'
import { tag } from '@/lib/cache'
import inngest from '@/lib/inngest/client'

async function revalidate(...tags: string[]) {
  for (const tag of tags) {
    console.log(`Queuing revalidation of "${tag}"`)
    await inngest.send({ name: 'cache/revalidate.tag', data: { tag } })
  }
}

export async function POST(request: Request) {
  const secret = request.headers.get('X-Contentful-Secret')
  const topic = request.headers.get('X-Contentful-Topic')
  const body = await request.json()

  if (process.env.NODE_ENV !== 'development' && secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  const get = <T = string>(path: string): T | undefined => {
    return _get(body, path)
  }

  if (topic?.startsWith('ContentManagement.Asset')) {
    const id = get('sys.id')
    id && (await revalidate(tag('asset', { id })))
    await revalidate('assets')
  }

  if (topic?.startsWith('ContentManagement.Entry')) {
    const type = get('sys.contentType.sys.id')
    const slug = get('fields.slug.en-US')

    if (type === 'setting') {
      const prefix = get('fields.key.en-US')?.split(/\./)?.[0]
      await revalidate(tag('entries', { type: 'setting', prefix }))
    } else if (type) {
      await revalidate(tag('entry', { type, slug }), tag('entries', { type }))
    }
  }

  return Response.json({ ok: true })
}
