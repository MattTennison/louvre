import { KVNamespace } from '@cloudflare/workers-types'

export type Env = {
  PHOTOS: KVNamespace
  PEXELS_API_KEY: string
}
