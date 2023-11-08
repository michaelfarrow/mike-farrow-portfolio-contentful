import http from 'http'

export function getRemoteBuffer(url: string, limit?: number): Promise<Buffer> {
  let buffer = Buffer.alloc(0)

  return new Promise((resolve, reject) => {
    http.get(url.replace(/^\/\//, 'http://'), (res) => {
      res.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk])
        if (limit != undefined && buffer.byteLength >= limit) {
          res.destroy()
        }
      })

      res.on('close', () => {
        resolve(buffer)
      })

      res.on('error', reject)
    })
  })
}
