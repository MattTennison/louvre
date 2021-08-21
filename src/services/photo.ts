import config from '../config'
import { z } from 'zod'

const PhotosResponse = z.object({
  page: z.number(),
  per_page: z.number(),
  photos: z.array(
    z.object({
      id: z.number(),
      width: z.number(),
      height: z.number(),
      url: z.string(),
      photographer: z.string(),
      photographer_url: z.string(),
      photographer_id: z.number(),
      avg_color: z.string(),
      src: z.object({
        original: z.string(),
        large2x: z.string(),
        large: z.string(),
        medium: z.string(),
        small: z.string(),
        portrait: z.string(),
        landscape: z.string(),
        tiny: z.string(),
      }),
    }),
  ),
  total_results: z.number(),
  next_page: z.string(),
})

export const search = async (searchTerm: string) => {
  const apiKey = config.pexels.authentication

  if (apiKey === undefined) {
    throw new Error('undefined.api.key')
  }

  const url = new URL('https://api.pexels.com/v1/search')
  url.searchParams.set('query', searchTerm)
  url.searchParams.set('per_page', '80')
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: apiKey,
    },
    method: 'GET',
  }).then((r) => r.json())

  const photos = PhotosResponse.parse(response)
  return photos
}
