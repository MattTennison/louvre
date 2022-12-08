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

  const response = await handleRequest()
  const body = await response.json()

  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toEqual('application/json')
  expect(response.headers.get('Access-Control-Allow-Origin')).toEqual('*')
  expect(body).toMatchSnapshot('200 Success Response Body')
})

test('when KeyValue is throwing errors', async () => {
  await handleScheduled()
  jest
    .spyOn(photosStore, 'get')
    .mockRejectedValue(new Error('something.not.right'))

  const response = await handleRequest()
  const body = await response.json()

  expect(response.status).toEqual(500)
  expect(body).toMatchSnapshot('500 Error Response Body')
})

test('when no entries are in the KeyValue store', async () => {
  const response = await handleRequest()
  const body = await response.json()

  expect(response.status).toEqual(503)
  expect(response.headers.get('Retry-After')).toEqual(
    '2021-08-22T00:30:00.000Z',
  )
  expect(body).toMatchSnapshot('503 Error Response Body')
})
