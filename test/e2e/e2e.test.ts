import pexelsSearchPhotosResponse from '../fixtures/pexels/search-photos.json'
import { KeyValueStore, stubKeyValueStore } from '../stub-key-value-store'
import { handleScheduled } from '../../src/load-data'
import { handleRequest } from '../../src/handler'
import MockDate from 'mockdate'

declare var global: any
let photosStore: KeyValueStore

beforeEach(() => {
  photosStore = stubKeyValueStore()
  jest.spyOn(Math, 'random').mockReturnValue(0.64)

  MockDate.set('2021-08-21T09:14:47.409Z')

  Object.assign(global, {
    PHOTOS: photosStore,
    fetch: () =>
      Promise.resolve({
        json: () => Promise.resolve(pexelsSearchPhotosResponse),
      }),
  })
  jest.resetModules()
})

afterEach(() => {
  MockDate.reset()
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
  "data": Object {
    "photo": Object {
      "attribution": Object {
        "link": Object {
          "source": "Pexels",
          "url": "https://www.pexels.com/photo/white-wooden-cabinet-1699655/",
        },
        "photographer": Object {
          "name": "Henry & Co.",
          "url": "https://www.pexels.com/@hngstrm",
        },
      },
      "avg_color": "#BFC0C5",
      "src": "https://images.pexels.com/photos/1699655/pexels-photo-1699655.jpeg",
    },
  },
}
`)
})

test('when KeyValue is throwing errors', async () => {
  await handleScheduled()
  jest
    .spyOn(photosStore, 'get')
    .mockRejectedValue(new Error('something.not.right'))

  const response = await handleRequest(new Request('/', { method: 'GET' }))
  const body = await response.json()

  expect(response.status).toEqual(500)
  expect(body).toMatchInlineSnapshot(`
Object {
  "error": "something.not.right",
}
`)
})

test('when no entries are in the KeyValue store', async () => {
  const response = await handleRequest(new Request('/', { method: 'GET' }))
  const body = await response.json()

  expect(response.status).toEqual(503)
  expect(response.headers.get('Retry-After')).toEqual(
    '2021-08-21T23:30:00.000Z',
  )
  expect(body).toMatchInlineSnapshot(`
Object {
  "error": "no.photos.in.cache",
}
`)
})
