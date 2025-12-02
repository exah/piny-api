import * as v from 'valibot'
import { UserNameSchema } from '@piny/user/schemas'

export const SessionIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.brand('SessionId')
)

export const SessionTokenSchema = v.pipe(v.string(), v.brand('SessionToken'))

export const SessionDeviceId = v.pipe(v.string(), v.brand('SessionToken'))

export const SessionDevice = v.object({
  id: SessionDeviceId,
  description: v.string(),
})

export const LoginPayloadSchema = v.object({
  user: UserNameSchema,
  pass: v.string(),
  device: SessionDevice,
})

export const SessionResponseSchema = v.object({
  token: SessionTokenSchema,
  expiresAt: v.date(),
})
