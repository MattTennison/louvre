import config from '../config'
import { z } from 'zod'

export const PexelsPhotoPayload = z.object({
  id: z.number(),
  width: z.number(),
  height: z.number(),
  url: z.string(),
  photographer: z.string(),
  photographer_url: z.string(),
  avg_color: z.string(),
  src: z.object({
    original: z.string(),
  }),
})

const PhotosResponse = z.object({
  page: z.number(),
  per_page: z.number(),
  photos: z.array(PexelsPhotoPayload),
  total_results: z.number(),
  next_page: z.string(),
})

export const search = async (apiKey: string, searchTerm: string) => {
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
