import { search } from './services/photo'

export async function handleScheduled() {
  const results = await search('minimalism')

  await Promise.all(
    results.photos.map((photo, index) =>
      PHOTOS.put(`minimalism:photo:${index}`, JSON.stringify(photo)),
    ),
  )
}
