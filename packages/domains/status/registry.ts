import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotAcceptableError,
  ConflictError,
  InternalServerError,
  ParsingError,
} from './errors'

export type RegisteredResponseError =
  | BadRequestError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError
  | NotAcceptableError
  | ConflictError
  | InternalServerError
  | ParsingError

export const ERRORS_REGISTRY = [
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotAcceptableError,
  ConflictError,
  InternalServerError,
  ParsingError,
] as const
