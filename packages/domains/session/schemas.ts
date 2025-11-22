import * as v from 'valibot'

export const SessionIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.brand('SessionId')
)

export const SessionTokenSchema = v.pipe(v.string(), v.brand('SessionToken'))

export const LoginPayloadSchema = v.object({
  user: v.string(),
  pass: v.string(),
})

export const SignupPayloadSchema = v.object({
  ...LoginPayloadSchema.entries,
  email: v.pipe(v.string(), v.email()),
})

export const MessageResponseSchema = v.object({
  message: v.string(),
})

export const TokenResponseSchema = v.object({
  token: SessionTokenSchema,
})
