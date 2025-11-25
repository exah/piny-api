import type * as v from 'valibot'
import type {
  UserIdSchema,
  UserSchema,
  UserParamsSchema,
  CreateUserPayloadSchema,
} from './schemas'

export type User = Strict<v.InferOutput<typeof UserSchema>>
export type UserId = v.InferOutput<typeof UserIdSchema>
export type UserType = User['type']
export type UserParams = v.InferOutput<typeof UserParamsSchema>
export type CreateUserPayload = v.InferOutput<typeof CreateUserPayloadSchema>
