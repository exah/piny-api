import * as v from 'valibot'
import { ErrorCode } from './constants'

export const RequestIdSchema = v.pipe(v.string(), v.uuid(), v.brand('RequestId'))
export const MessageResponseSchema = v.object({ message: v.string() })

export const ErrorIdSchema = v.pipe(v.string(), v.uuid(), v.brand('ErrorId'))
export const ErrorCodeSchema = v.enum(ErrorCode)
export const ErrorResponseSchema = v.object({
  id: ErrorIdSchema,
  code: ErrorCodeSchema,
  meta: v.optional(v.unknown()),
  requestId: v.optional(RequestIdSchema),
  ...MessageResponseSchema.entries,
})
