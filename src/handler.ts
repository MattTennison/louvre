import { search } from './services/photo'
import { pickRandom } from './utils/pick-random'

const createResponse = (body: Object, init?: ResponseInit) => {
  const response = new Response(JSON.stringify(body), init)
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}

export async function handleRequest(request: Request): Promise<Response> {
  try {
    const { keys } = await PHOTOS.list({ prefix: 'minimalism:photo' })
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

    const {
      src: { original },
      avg_color,
    } = JSON.parse(result)

    return createResponse({ url: original, avg_color })
  } catch (e) {
    return createResponse(
      { error: e.message },
      {
        status: 500,
      },
    )
  }
}
