import { pickRandom } from './utils/pick-random'
import cronParser from 'cron-parser'
import config from './config'
import { PexelsPhotoPayload } from './services/photo'

const createResponse = (body: Object, init?: ResponseInit) => {
  const response = new Response(JSON.stringify(body), init)
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Content-Type', 'application/json')
  return response
}

export async function handleRequest(request: Request): Promise<Response> {
  try {
    const { keys } = await PHOTOS.list({ prefix: 'minimalism:photo' })
    if (keys.length === 0) {
      const response = createResponse(
        { error: 'no.photos.in.cache' },
        {
          status: 503,
        },
      )

      response.headers.set(
        'Retry-After',
        cronParser
          .parseExpression(config.schedule.cron, { tz: 'Europe/London' })
          .next()
          .toISOString(),
      )

      return response
    }

    const { name } = pickRandom(keys)
    const result = await PHOTOS.get(name)

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
    return createResponse(
      { error: e.message },
      {
        status: 500,
      },
    )
  }
}
