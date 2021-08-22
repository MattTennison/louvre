import pexelsSearchPhotosResponse from '../fixtures/pexels/search-photos.json'
import { stubKeyValueStore } from '../stub-key-value-store'
import { handleScheduled } from '../../src/load-data'
import { handleRequest } from '../../src/handler'

declare var global: any

jest.spyOn(Math, 'random').mockReturnValue(0.64)

beforeEach(() => {
  const photosStore = stubKeyValueStore()

  Object.assign(global, {
    PHOTOS: photosStore,
    fetch: () =>
      Promise.resolve({
        json: () => Promise.resolve(pexelsSearchPhotosResponse),
      }),
  })
  jest.resetModules()
})

test('with initalised store', async () => {
  await handleScheduled()

  const response = await handleRequest(new Request('/', { method: 'GET' }))
  const body = await response.json()

  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toEqual('application/json')
  expect(response.headers.get('Access-Control-Allow-Origin')).toEqual('*')
  expect(body).toMatchInlineSnapshot(`
Object {
  "avg_color": "#BFC0C5",
  "url": "https://images.pexels.com/photos/1699655/pexels-photo-1699655.jpeg",
}
`)
})
