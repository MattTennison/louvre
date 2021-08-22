import { handleRequest } from '../src/handler'
import makeServiceWorkerEnv from 'service-worker-mock'
import pexelsSearchPhotosResponse from './fixtures/pexels/search-photos.json'
import 'jest-extended'

declare var global: any

describe('handleRequest', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv(), {
      PHOTOS: {
        list: () =>
          Promise.resolve({
            keys: pexelsSearchPhotosResponse.photos.map((_, index) => ({
              name: `minimalism:photo:${index}`,
            })),
          }),
        get: (key: string) => {
          const index = Number.parseInt(key.replace('minimalism:photo:', ''))
          return Promise.resolve(
            JSON.stringify(pexelsSearchPhotosResponse.photos[index]),
          )
        },
      },
    })
    jest.resetModules()
  })

  test('returns a random photo from the Pexels API', async () => {
    const result = await handleRequest(
      new Request('/', { method: 'GET' }),
    ).then((r) => r.json())

    expect(result.url).toBeOneOf(
      pexelsSearchPhotosResponse.photos.map((p) => p.src.original),
    )
  })

  test('includes Access Control Allow Origin * header', async () => {
    const result = await handleRequest(new Request('/', { method: 'GET' }))

    expect(result.headers.get('Access-Control-Allow-Origin')).toEqual('*')
  })
})
