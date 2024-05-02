import { handleRequest } from './handler'
import { handleScheduled } from './load-data'
import { Env } from './types'

export default {
  fetch: (_: Request, env: Env) => handleRequest(env),
  scheduled: (_: Event, env: Env) => handleScheduled(env),
}
