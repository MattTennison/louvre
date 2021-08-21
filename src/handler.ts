import { search } from './services/photo'
import { pickRandom } from './utils/pick-random'

export async function handleRequest(request: Request): Promise<Response> {
  const { photos } = await search('minimalism')
  const {
    src: { original },
    avg_color,
  } = pickRandom(photos)

  const response = new Response(JSON.stringify({ url: original, avg_color }))
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}
