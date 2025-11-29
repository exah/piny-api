import * as v from 'valibot'
import { match } from 'lil-match'
import {
  ResponseError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotAcceptableError,
  ConflictError,
  InternalServerError,
  ParsingError,
} from './errors'
import { ErrorIdSchema, ErrorCodeSchema } from './schemas'
import type { ErrorCode, RegisteredResponseError } from './types'

export const createErrorId = () =>
  v.parseAsync(ErrorIdSchema, crypto.randomUUID())

export const isResponseError = (
  error: unknown
): error is RegisteredResponseError => error instanceof ResponseError

export const getErrorByCode = (code: ErrorCode) =>
  match<ErrorCode>(code)
    .with(ErrorCodeSchema.enum.BAD_REQUEST, () => BadRequestError)
    .with(ErrorCodeSchema.enum.CONFLICT, () => ConflictError)
    .with(ErrorCodeSchema.enum.FORBIDDEN, () => ForbiddenError)
    .with(ErrorCodeSchema.enum.UNAUTHORIZED, () => UnauthorizedError)
    .with(ErrorCodeSchema.enum.NOT_FOUND, () => NotFoundError)
    .with(ErrorCodeSchema.enum.NOT_ACCEPTABLE, () => NotAcceptableError)
    .with(ErrorCodeSchema.enum.INTERNAL_SERVER_ERROR, () => InternalServerError)
    .with(ErrorCodeSchema.enum.PARSING_ERROR, () => ParsingError)
    .exhaustive(`Unhandled error code: ${code}`)

export const createErrorByCode = (code: ErrorCode) =>
  new (getErrorByCode(code))()
