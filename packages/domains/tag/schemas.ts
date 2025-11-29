import * as v from 'valibot'

export const TagIdSchema = v.pipe(v.string(), v.uuid(), v.brand('TagId'))
export const TagNameSchema = v.pipe(
  v.string(),
  v.nonEmpty(),
  v.brand('TagName')
)

export const TagSchema = v.object({
  id: TagIdSchema,
  name: TagNameSchema,
})

export const TagsListResponseSchema = v.array(TagSchema)
