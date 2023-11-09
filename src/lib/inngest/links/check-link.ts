import axios from 'axios'

import inngest from '@/lib/inngest/client'

function allowedError(e: any) {
  return [
    999, // linkedin not logged in error
  ].includes(e?.response?.status)
}

async function checkUrl(url: string) {
  try {
    await axios.head(url, { timeout: 3500 })
  } catch (e) {
    if (allowedError(e)) return true
    try {
      await axios.get(url, { timeout: 4000 })
    } catch (e) {
      if (allowedError(e)) return true
      return false
    }
  }
  return true
}

export default inngest.createFunction(
  {
    id: 'links-check-link',
    concurrency: {
      limit: 1,
    },
  },
  {
    event: 'links/check.link',
  },
  async ({ step, event }) => {
    const { type, name, url } = event.data

    return await step.run('Check URL', async () => {
      return {
        type,
        name,
        url,
        ok: await checkUrl(url),
      }
    })
  }
)
