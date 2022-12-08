import { z } from 'zod'

export const listSchema = z.object({
  keys: z.array(
    z.object({
      name: z.string(),
    }),
  ),
})

export const getList = async (prefix: string) => {
  const item = await PHOTOS.get(`${prefix}:list`)
  if (item === null) {
    return null
  }

  const parseResult = listSchema.safeParse(JSON.parse(item))
  if (!parseResult.success) {
    return null
  }
  return parseResult.data
}
