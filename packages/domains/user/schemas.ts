import * as v from 'valibot'

export const UserIdSchema = v.pipe(v.string(), v.uuid(), v.brand('UserId'))

export const UserNameSchema = v.pipe(
  v.string(),
  v.nonEmpty(),
  v.regex(/[a-z0-9.-]/),
  v.toLowerCase(),
  v.brand('UserName')
)

export const UserEmailSchema = v.pipe(
  v.string(),
  v.email(),
  v.brand('UserEmail')
)

export const UserSchema = v.variant('type', [
  v.object({
    id: UserIdSchema,
    type: v.literal('current'),
    name: UserNameSchema,
    email: UserEmailSchema,
  }),
  v.object({
    id: UserIdSchema,
    type: v.literal('other'),
    name: UserNameSchema,
  }),
])

export const UserParamsSchema = v.object({
  user: v.optional(UserNameSchema),
})

export const CreateUserPayloadSchema = v.object({
  email: UserEmailSchema,
  user: UserNameSchema,
  pass: v.string(),
})
