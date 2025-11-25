import * as v from 'valibot'
import { UserNameSchema } from '@piny/user/schemas'

export const SessionIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.brand('SessionId')
)

export const SessionTokenSchema = v.pipe(v.string(), v.brand('SessionToken'))

export const LoginPayloadSchema = v.object({
  user: UserNameSchema,
  pass: v.string(),
})

export const TokenResponseSchema = v.object({
  token: SessionTokenSchema,
})
