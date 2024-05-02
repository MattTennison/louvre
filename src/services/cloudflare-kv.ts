import { z } from 'zod'
import { KVNamespace } from '@cloudflare/workers-types'

export const listSchema = z.object({
  keys: z.array(
    z.object({
      name: z.string(),
    }),
  ),
})

export const getList = async (namespace: KVNamespace, prefix: string) => {
  const item = await namespace.get(`${prefix}:list`)
  if (item === null) {
    return null
  }

  const parseResult = listSchema.safeParse(JSON.parse(item))
  if (!parseResult.success) {
    return null
  }
  return parseResult.data
}
