import { ErrorCode } from './constants'

export type ResponseErrorVariant =
  | BadRequest
  | Unauthorized
  | Forbidden
  | NotFound
  | NotAcceptable
  | Conflict
  | SomethingWentWrong

interface ResponseErrorOptions<Meta = never> {
  cause?: unknown
  meta?: Meta
  url?: URL
  id?: string
}

export abstract class ResponseError<Meta = never> extends Error {
  name = 'ResponseError'

  readonly code: ErrorCode
  readonly status: number
  readonly message: string

  description?: string
  cause?: unknown
  meta?: unknown
  url?: URL
  id?: string

  constructor(description?: string, options?: ResponseErrorOptions<Meta>) {
    super()
    if (description) this.description = description
    if (options?.cause) this.cause = options.cause
    if (options?.meta) this.meta = options.meta
    if (options?.url) this.url = options.url
    if (options?.id) this.id = options.id
  }
}

export class BadRequest<Meta = never> extends ResponseError<Meta> {
  code: typeof ErrorCode.BAD_REQUEST = ErrorCode.BAD_REQUEST
  status = 400
  message = '👎 Bad request'
}

export class Unauthorized<Meta = never> extends ResponseError<Meta> {
  code: typeof ErrorCode.UNAUTHORIZED = ErrorCode.UNAUTHORIZED
  status = 401
  message = '🙅‍♂️ Not authorized'
}

export class Forbidden<Meta = never> extends ResponseError<Meta> {
  code: typeof ErrorCode.FORBIDDEN = ErrorCode.FORBIDDEN
  status = 403
  message = '✋ Denied'
}

export class NotFound<Meta = never> extends ResponseError<Meta> {
  code: typeof ErrorCode.NOT_FOUND = ErrorCode.NOT_FOUND
  status = 404
  message = '🤷‍♂️ Not found'
}

export class NotAcceptable<Meta = never> extends ResponseError<Meta> {
  code: typeof ErrorCode.NOT_ACCEPTABLE = ErrorCode.NOT_ACCEPTABLE
  status = 406
  message = '👀 What is it?'
}

export class Conflict<Meta = never> extends ResponseError<Meta> {
  code: typeof ErrorCode.CONFLICT = ErrorCode.CONFLICT
  status = 409
  message = '🙅‍♂️ Already exists'
}

export class SomethingWentWrong<Meta = never> extends ResponseError<Meta> {
  code: typeof ErrorCode.SOMETHING_WENT_WRONG = ErrorCode.SOMETHING_WENT_WRONG
  status = 500
  message = '😭 Something went wrong'
}
