import * as v from 'valibot'

export const UserIdSchema = v.pipe(v.string(), v.uuid(), v.brand('UserId'))

export const UserResponseSchema = v.variant('type', [
  v.object({
    id: UserIdSchema,
    type: v.literal('current'),
    name: v.string(),
    email: v.string(),
  }),
  v.object({
    id: UserIdSchema,
    type: v.literal('other'),
    name: v.string(),
  }),
])

export const UserParamsSchema = v.object({
  user: v.optional(v.string()),
})
