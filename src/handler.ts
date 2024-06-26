import { pickRandom } from './utils/pick-random'
import cronParser from 'cron-parser'
import { PexelsPhotoPayload } from './services/photo'
import { getList } from './services/cloudflare-kv'
import { Env } from './types'

const createResponse = (body: Record<string, unknown>, init?: ResponseInit) => {
  const response = new Response(JSON.stringify(body), init)
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Content-Type', 'application/json')
  return response
}

export const handleRequest = async (env: Env): Promise<Response> => {
  try {
    const list = await getList(env.PHOTOS, 'minimalism:photo')
    if (list === null || list.keys.length === 0) {
      const response = createResponse(
        { error: 'no.photos.in.cache' },
        {
          status: 503,
        },
      )

      response.headers.set(
        'Retry-After',
        cronParser
          .parseExpression('40 0 * * *', { tz: 'UTC' })
          .next()
          .toISOString(),
      )

      return response
    }

    const { name } = pickRandom(list.keys)
    const result = await env.PHOTOS.get(name)

    if (result === null) {
      return createResponse(
        { error: 'missing.photo.in.cache' },
        {
          status: 500,
        },
      )
    }

    const photo = PexelsPhotoPayload.parse(JSON.parse(result))
    const {
      src: { original },
      avg_color,
      photographer,
      photographer_url,
      url,
    } = photo

    return createResponse({
      data: {
        photo: {
          src: original,
          avg_color,
          attribution: {
            photographer: { name: photographer, url: photographer_url },
            link: { source: 'Pexels', url },
          },
        },
      },
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'unknown.error'

    return createResponse(
      { error },
      {
        status: 500,
      },
    )
  }
}
