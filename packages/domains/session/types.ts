import * as v from 'valibot'
import {
  SessionIdSchema,
  SessionTokenSchema,
  LoginPayloadSchema,
  SignupPayloadSchema,
  TokenResponseSchema,
  MessageResponseSchema,
} from './schemas'

export type SessionId = v.InferOutput<typeof SessionIdSchema>
export type SessionToken = v.InferOutput<typeof SessionTokenSchema>

export type LoginPayload = v.InferOutput<typeof LoginPayloadSchema>
export type SignupPayload = v.InferOutput<typeof SignupPayloadSchema>
export type TokenResponse = v.InferOutput<typeof TokenResponseSchema>
export type MessageResponse = v.InferOutput<typeof MessageResponseSchema>
