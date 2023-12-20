import { z, ZodRawShape, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

function isZodError(e: any): e is ZodError {
  return e.hasOwnProperty('issues')
}

export async function checkParams<T extends ZodRawShape>(
  req: Request,
  type: (instance: typeof z) => T,
  f: (params: z.infer<ReturnType<typeof z.object<T>>>) => Response
) {
  const _type = z.object(type(z))
  try {
    return f(_type.parse(await req.json()))
  } catch (e) {
    return new Response((isZodError(e) && fromZodError(e).toString()) || 'Error', {
      status: 500,
    })
  }
}
