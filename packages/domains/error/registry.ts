import {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  NotAcceptable,
  Conflict,
  SomethingWentWrong,
} from './errors'

export const ERRORS_REGISTRY = [
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  NotAcceptable,
  Conflict,
  SomethingWentWrong,
] as const
