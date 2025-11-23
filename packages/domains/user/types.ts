import type * as v from 'valibot'
import type { UserIdSchema, UserResponseSchema } from './schemas'

export type User = Strict<v.InferOutput<typeof UserResponseSchema>>
export type UserId = v.InferOutput<typeof UserIdSchema>
export type UserType = User['type']
