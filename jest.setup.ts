import makeServiceWorkerEnv from 'service-worker-mock'

declare var global: any

Object.assign(global, makeServiceWorkerEnv(), {
  PEXELS_API_KEY: 'foobar',
})
