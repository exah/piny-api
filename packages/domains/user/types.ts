import * as v from 'valibot'
import { UserIdSchema, UserResponseSchema } from './schemas'

export type UserId = v.InferOutput<typeof UserIdSchema>
export type UserResponse = v.InferOutput<typeof UserResponseSchema>
export type UserType = UserResponse['type']
