import * as v from 'valibot'
import { ErrorCode } from './constants'

export const MessageResponseSchema = v.object({
  message: v.string(),
})

export const ErrorIdSchema = v.pipe(v.string(), v.uuid(), v.brand('ErrorId'))
export const ErrorCodeSchema = v.enum(ErrorCode)
export const ErrorResponseSchema = v.object({
  id: ErrorIdSchema,
  code: ErrorCodeSchema,
  meta: v.optional(v.unknown()),
  ...MessageResponseSchema.entries,
})
