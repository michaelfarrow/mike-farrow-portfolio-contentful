import axios from 'axios'

import inngest from '@/lib/inngest/client'
import knock from '@/lib/knock'
import { OK_REGEX } from '@/lib/link'

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
      limit: 10,
    },
  },
  {
    event: 'links/check.link',
  },
  async ({
    step,
    event: {
      data,
      data: { url },
    },
  }) => {
    const status = await step.run('Check URL', async () =>
      url.match(OK_REGEX) ? 2 : (await checkUrl(url)) ? 1 : 0
    )

    const ok = status > 0
    const skipped = status === 2

    if (!ok) {
      await step.run('Report URL', () =>
        knock.workflows.trigger('report-link', {
          recipients: ['0'],
          data,
        })
      )
    }

    return { ...data, ok, skipped }
  }
)
