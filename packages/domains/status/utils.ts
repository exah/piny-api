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
import { ErrorIdSchema } from './schemas'
import { BaseErrorCode, ApiErrorCode } from './constants'
import type { ErrorCode, RegisteredResponseError } from './types'

export const createErrorId = () =>
  v.parseAsync(ErrorIdSchema, crypto.randomUUID())

export const isResponseError = (
  error: unknown
): error is RegisteredResponseError => error instanceof ResponseError

export const getErrorByCode = (code: ErrorCode) =>
  match<ErrorCode>(code)
    .with(BaseErrorCode.BAD_REQUEST, () => BadRequestError)
    .with(BaseErrorCode.CONFLICT, () => ConflictError)
    .with(BaseErrorCode.FORBIDDEN, () => ForbiddenError)
    .with(BaseErrorCode.UNAUTHORIZED, () => UnauthorizedError)
    .with(BaseErrorCode.NOT_FOUND, () => NotFoundError)
    .with(BaseErrorCode.NOT_ACCEPTABLE, () => NotAcceptableError)
    .with(BaseErrorCode.INTERNAL_SERVER_ERROR, () => InternalServerError)
    .with(ApiErrorCode.PARSING_ERROR, () => ParsingError)
    .exhaustive(`Unhandled error code: ${code}`)

export const createErrorByCode = (code: ErrorCode) =>
  new (getErrorByCode(code))()
