import { handleRequest } from './handler'
import { handleScheduled } from './load-data'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest())
})

addEventListener('scheduled', (event) => {
  event.waitUntil(handleScheduled())
})
