import { serialize } from 'cookie'
import env from '@/lib/env-secret'
import { checkParams } from '@/lib/route'

export async function POST(request: Request) {
  return checkParams(
    request,
    (z) => ({
      password: z.string(),
    }),
    ({ password }) => {
      const cookie = serialize(env.PAGE_PASSWORD_COOKIE_NAME!, 'true', {
        httpOnly: true,
        path: '/',
      })

      if (env.PAGE_PASSWORD !== password) {
        return new Response('Password incorrect', {
          status: 401,
        })
      }

      return new Response('Password correct', {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
        },
      })
    }
  )
}
