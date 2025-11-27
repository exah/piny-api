import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotAcceptableError,
  ConflictError,
  InternalServerError,
} from './errors'

export type RegisteredResponseError =
  | BadRequestError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError
  | NotAcceptableError
  | ConflictError
  | InternalServerError

export const ERRORS_REGISTRY = [
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotAcceptableError,
  ConflictError,
  InternalServerError,
] as const
