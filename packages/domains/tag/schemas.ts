import * as v from 'valibot'

export const TagIdSchema = v.pipe(v.string(), v.uuid(), v.brand('TagId'))

export const TagSchema = v.object({
  id: TagIdSchema,
  name: v.string(),
})

export const TagsListResponseSchema = v.array(TagSchema)
