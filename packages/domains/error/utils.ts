import * as v from 'valibot'
import { ResponseError } from './errors'
import type { ResponseErrorVariant } from './errors'
import { ErrorIdSchema, ErrorCodeSchema } from './schemas'

export const createErrorId = () =>
  v.parseAsync(ErrorIdSchema, crypto.randomUUID())

export const isResponseError = (
  error: unknown
): error is ResponseErrorVariant => error instanceof ResponseError

export const getErrorCode = v.parser(ErrorCodeSchema)
