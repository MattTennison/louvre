import { search } from './services/photo'
import { Env } from './types'

export async function handleScheduled(env: Env) {
  const results = await search(env.PEXELS_API_KEY, 'minimalism')

  const individualPhotoItems = results.photos.map((photo) => ({
    key: `minimalism:photo:${photo.id}`,
    value: photo,
  }))

  const itemsToWrite = [
    ...individualPhotoItems,
    {
      key: 'minimalism:photo:list',
      value: {
        keys: results.photos.map((photo) => ({
          name: `minimalism:photo:${photo.id}`,
        })),
      },
    },
  ]

  await Promise.all([
    ...itemsToWrite.map(({ key, value }) =>
      env.PHOTOS.put(key, JSON.stringify(value)),
    ),
  ])
}
