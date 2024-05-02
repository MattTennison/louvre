import pexelsSearchPhotosResponse from '../fixtures/pexels/search-photos.json'
import { KeyValueStore, stubKeyValueStore } from '../stub-key-value-store'
import { handleScheduled } from '../../src/load-data'
import { handleRequest } from '../../src/handler'
import MockDate from 'mockdate'
import { Env } from '../../src/types'
import { KVNamespace } from '@cloudflare/workers-types'
import nock from 'nock'

let photosStore: KeyValueStore
let env: Env

beforeEach(() => {
  photosStore = stubKeyValueStore()
  jest.spyOn(Math, 'random').mockReturnValue(0.64)

  MockDate.set('2021-08-21T09:14:47.409Z')

  nock('https://api.pexels.com')
    .get('/v1/search')
    .query({
      query: 'minimalism',
      per_page: 80,
    })
    .reply(200, pexelsSearchPhotosResponse)

  nock.disableNetConnect()

  env = {
    PHOTOS: photosStore as unknown as KVNamespace,
    PEXELS_API_KEY: 'PEXELS_API_KEY',
  }
})

afterEach(() => {
  MockDate.reset()
})

test('with initalised store', async () => {
  await handleScheduled(env)

  const response = await handleRequest(env)
  const body = await response.json()

  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toEqual('application/json')
  expect(response.headers.get('Access-Control-Allow-Origin')).toEqual('*')
  expect(body).toMatchSnapshot('200 Success Response Body')
})

test('when KeyValue is throwing errors', async () => {
  await handleScheduled(env)
  jest
    .spyOn(photosStore, 'get')
    .mockRejectedValue(new Error('something.not.right'))

  const response = await handleRequest(env)
  const body = await response.json()

  expect(response.status).toEqual(500)
  expect(body).toMatchSnapshot('500 Error Response Body')
})

test('when no entries are in the KeyValue store', async () => {
  const response = await handleRequest(env)
  const body = await response.json()

  expect(response.status).toEqual(503)
  expect(response.headers.get('Retry-After')).toEqual(
    '2021-08-22T00:40:00.000Z',
  )
  expect(body).toMatchSnapshot('503 Error Response Body')
})
