import { search } from './services/photo'

export async function handleScheduled() {
  const results = await search('minimalism')

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
      PHOTOS.put(key, JSON.stringify(value)),
    ),
  ])
}
