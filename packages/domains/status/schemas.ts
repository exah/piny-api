import * as v from 'valibot'
import { BaseErrorCode, ApiErrorCode } from './constants'

export const MessageResponseSchema = v.object({
  message: v.string(),
})

export const ErrorIdSchema = v.pipe(v.string(), v.uuid(), v.brand('ErrorId'))
export const ErrorCodeSchema = v.enum({ ...BaseErrorCode, ...ApiErrorCode })

const BaseErrorCodeDataSchema = v.object({
  id: ErrorIdSchema,
  code: v.enum(BaseErrorCode),
  meta: v.optional(v.unknown()),
  ...MessageResponseSchema.entries,
})

const ParseErrorCodeDataSchema = v.object({
  ...BaseErrorCodeDataSchema.entries,
  code: v.literal(ApiErrorCode.PARSING_ERROR),
  meta: v.array(v.custom<v.GenericIssue>(() => true)),
})

export const ErrorResponseSchema = v.variant('code', [
  BaseErrorCodeDataSchema,
  ParseErrorCodeDataSchema,
])
