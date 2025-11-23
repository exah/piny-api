import * as v from 'valibot'

export const LinkIdSchema = v.pipe(v.string(), v.uuid(), v.brand('LinkId'))

export const LinkSchema = v.object({
  id: LinkIdSchema,
  url: v.pipe(v.string(), v.url()),
})
