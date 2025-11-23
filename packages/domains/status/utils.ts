import * as v from 'valibot'
import { ResponseError } from './errors'
import { ErrorIdSchema, ErrorCodeSchema } from './schemas'
import type { RegisteredResponseError } from './registry'

export const createErrorId = () =>
  v.parseAsync(ErrorIdSchema, crypto.randomUUID())

export const isResponseError = (
  error: unknown
): error is RegisteredResponseError => error instanceof ResponseError

export const getErrorCode = v.parser(ErrorCodeSchema)
