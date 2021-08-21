import { handleRequest } from '../src/handler'
import makeServiceWorkerEnv from 'service-worker-mock'
import pexelsSearchPhotosResponse from './fixtures/pexels/search-photos.json'
import 'jest-extended'

declare var global: any

describe('handle', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv(), {
      fetch: () =>
        Promise.resolve({
          json: () => Promise.resolve(pexelsSearchPhotosResponse),
        }),
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
