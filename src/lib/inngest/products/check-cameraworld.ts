import inngest from '@/lib/inngest/client'

import settings from '@/lib/settings'

export default inngest.createFunction(
  {
    id: 'products-check-cameraworld',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'products/check.cameraworld' },
  async ({ step }) => {
    const products = await step.run('Fetch CameraWorld products to check', async () => {
      const s = await settings('products')
      const products = s.textArray('cameraworld', [])

      return products.map((product) => {
        const split = product.split(/\s+/)
        const id = split[0]
        const target = (split[1] && Number(split[1])) || undefined

        return {
          id,
          target: !target || isNaN(target) ? undefined : target,
        }
      })
    })

    for (const product of products) {
      await step.sendEvent('Dispatch check CameraWorld product event', {
        name: 'products/check.cameraworld-product',
        data: product,
      })
    }

    return {
      done: true,
      dispatched: products.length,
    }
  }
)
