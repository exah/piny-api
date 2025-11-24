import {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  NotAcceptable,
  Conflict,
  SomethingWentWrong,
} from './errors'

export type RegisteredResponseError =
  | BadRequest
  | Unauthorized
  | Forbidden
  | NotFound
  | NotAcceptable
  | Conflict
  | SomethingWentWrong

export const ERRORS_REGISTRY = [
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  NotAcceptable,
  Conflict,
  SomethingWentWrong,
] as const
