import type * as v from 'valibot'
import type {
  ErrorIdSchema,
  ErrorCodeSchema,
  ErrorResponseSchema,
} from './schemas'

export type ErrorId = v.InferOutput<typeof ErrorIdSchema>
export type ErrorCode = v.InferOutput<typeof ErrorCodeSchema>
export type ErrorResponse = v.InferOutput<typeof ErrorResponseSchema>
