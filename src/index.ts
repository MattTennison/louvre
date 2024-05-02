import { handleRequest } from './handler'
import { handleScheduled } from './load-data'

export default {
  fetch: () => handleRequest(),
  scheduled: () => handleScheduled(),
}
