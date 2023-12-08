import axios from 'axios'

import inngest from '@/lib/inngest/client'
import knock from '@/lib/knock'

async function lookupProduct(id: string) {
  const query = {
    context: { apiKeys: [process.env.CAMERAWORLD_API_KEY] },
    suggestions: [
      {
        id: 'autosuggestion',
        query: id,
        typeOfRequest: 'AUTO_SUGGESTIONS',
        limit: 5,
      },
    ],
    recordQueries: [
      {
        id: 'categoryCompressed',
        typeOfRequest: 'SEARCH',
        settings: {
          query: { term: id },
          typeOfRecords: ['KLEVU_CATEGORY'],
          fields: ['id', 'name', 'shortDesc', 'url', 'typeOfRecord'],
          limit: '9',
          searchPrefs: ['searchCompoundsAsAndQuery'],
          sort: 'RELEVANCE',
        },
      },
      {
        id: 'cmsCompressed',
        typeOfRequest: 'SEARCH',
        settings: {
          query: { term: id },
          typeOfRecords: ['KLEVU_CMS'],
          fields: ['id', 'name', 'shortDesc', 'url', 'typeOfRecord'],
          limit: 3,
          searchPrefs: ['searchCompoundsAsAndQuery'],
          sort: 'RELEVANCE',
        },
      },
      {
        id: 'productList',
        typeOfRequest: 'SEARCH',
        settings: {
          query: { term: id },
          typeOfRecords: ['KLEVU_PRODUCT'],
          fields: ['*'],
          limit: '9',
          searchPrefs: ['searchCompoundsAsAndQuery'],
          sort: 'RELEVANCE',
          fallbackQueryId: 'productListFallback',
        },
      },
      {
        id: 'productListFallback',
        typeOfRequest: 'SEARCH',
        isFallbackQuery: 'true',
        settings: {
          query: { term: '*' },
          typeOfRecords: ['KLEVU_PRODUCT'],
          limit: 3,
          searchPrefs: ['excludeDescription', 'searchCompoundsAsAndQuery'],
          sort: 'RELEVANCE',
        },
      },
    ],
  }

  return await axios.post('https://eucs29v2.ksearchnet.com/cs/v2/search', query).then((res) => {
    const results = res.data?.queryResults?.find((r: any) => r.id === 'productList')?.records
    const result = results[0]

    if (result) {
      return {
        name: String(result.name),
        price: Number(result.basePrice),
        specialPrice: Number(result.special_price),
        url: String(result.url),
      }
    }

    return null
  })
}

export default inngest.createFunction(
  {
    id: 'track-check-cameraworld-product',
    concurrency: {
      limit: 1,
    },
  },
  { event: 'track/check.cameraworld-product' },
  async ({
    step,
    event: {
      data: { id, target },
    },
  }) => {
    const product = await step.run('Lookup CameraWorld product', () => lookupProduct(id))

    const found = !!product
    const specialMet = (found && product.specialPrice === product.price) || false
    const targetMet = (found && target && product.price <= target) || false
    const data = {
      id,
      type: 'CameraWorld',
      target,
      product,
      targetMet,
      specialMet,
    }

    if (!found || targetMet || specialMet) {
      await step.run('Report Product', () =>
        knock.workflows.trigger('report-product', {
          recipients: ['0'],
          data,
        })
      )
    }

    return {
      done: true,
      found,
      ...data,
    }
  }
)
