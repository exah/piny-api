import type * as v from 'valibot'
import type {
  UserSchema,
  UserIdSchema,
  UserNameSchema,
  UserEmailSchema,
  UserParamsSchema,
  CreateUserPayloadSchema,
} from './schemas'

export type User = Strict<v.InferOutput<typeof UserSchema>>
export type UserId = v.InferOutput<typeof UserIdSchema>
export type UserName = v.InferOutput<typeof UserNameSchema>
export type UserEmail = v.InferOutput<typeof UserEmailSchema>
export type UserType = User['type']
export type UserParams = v.InferOutput<typeof UserParamsSchema>
export type CreateUserPayload = v.InferOutput<typeof CreateUserPayloadSchema>
