import type * as v from 'valibot'
import type {
  SessionIdSchema,
  SessionTokenSchema,
  LoginPayloadSchema,
  SessionResponseSchema,
} from './schemas'

export type SessionId = v.InferOutput<typeof SessionIdSchema>
export type SessionToken = v.InferOutput<typeof SessionTokenSchema>

export type LoginPayload = v.InferOutput<typeof LoginPayloadSchema>
export type TokenResponse = v.InferOutput<typeof SessionResponseSchema>
