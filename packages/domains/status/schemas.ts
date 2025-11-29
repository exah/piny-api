import * as v from 'valibot'
import { BaseErrorCode, ApiErrorCode } from './constants'

export const MessageResponseSchema = v.object({
  message: v.string(),
})

export const ErrorIdSchema = v.pipe(v.string(), v.uuid(), v.brand('ErrorId'))
export const ErrorCodeSchema = v.enum({ ...BaseErrorCode, ...ApiErrorCode })

export const ErrorResponseSchema = v.object({
  id: ErrorIdSchema,
  code: v.enum(BaseErrorCode),
  meta: v.optional(v.unknown()),
  ...MessageResponseSchema.entries,
})
