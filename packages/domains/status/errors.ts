import type * as v from 'valibot'
import type { ErrorCode, UnknownSchema } from './types'
import { ErrorCodeSchema } from './schemas'
import { getErrorCode } from './utils'

interface ResponseErrorOptions<Meta = never> {
  cause?: unknown
  meta?: Meta
  url?: URL
  id?: string
}

export abstract class ResponseError<Meta = never> extends Error {
  name = 'ResponseError'
  expose = true

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
    if ('code' in this.constructor)
      this.code = getErrorCode(this.constructor.code)

    if (description) this.description = description
    if (options?.cause) this.cause = options.cause
    if (options?.meta) this.meta = options.meta
    if (options?.url) this.url = options.url
    if (options?.id) this.id = options.id
  }
}

export class BadRequestError<Meta = never> extends ResponseError<Meta> {
  static code = ErrorCodeSchema.enum.BAD_REQUEST
  status = 400
  message = '👎 Bad request'
}

export class UnauthorizedError<Meta = never> extends ResponseError<Meta> {
  static code = ErrorCodeSchema.enum.UNAUTHORIZED
  status = 401
  message = '🙅‍♂️ Unauthorized'
}

export class ForbiddenError<Meta = never> extends ResponseError<Meta> {
  static code = ErrorCodeSchema.enum.FORBIDDEN
  status = 403
  message = '✋ Denied'
}

export class NotFoundError<Meta = never> extends ResponseError<Meta> {
  static code = ErrorCodeSchema.enum.NOT_FOUND
  status = 404
  message = '🤷‍♂️ Not found'
}

export class NotAcceptableError<Meta = never> extends ResponseError<Meta> {
  static code = ErrorCodeSchema.enum.NOT_ACCEPTABLE
  status = 406
  message = '👀 What is it?'
}

export class ConflictError<Meta = never> extends ResponseError<Meta> {
  static code = ErrorCodeSchema.enum.CONFLICT
  status = 409
  message = '🙅‍♂️ Already exists'
}

export class InternalServerError<Meta = never> extends ResponseError<Meta> {
  static code = ErrorCodeSchema.enum.INTERNAL_SERVER_ERROR
  status = 500
  message = '😭 Something went wrong'
}

export class ParsingError<
  Issue extends v.GenericIssue = v.GenericIssue
> extends BadRequestError<Issue[]> {
  static code = ErrorCodeSchema.enum.PARSING_ERROR

  constructor(cause: v.ValiError<UnknownSchema<Issue>>) {
    const reasons = cause.issues.map((issue) => {
      if (!issue.path) {
        return issue.message
      }

      return `'${issue.path.map((item) => item.key).join('.')}': ${
        issue.message
      }`
    })

    super(`🤦‍♂️ Parsing error:\n${reasons.join('\n')}`, {
      cause,
      meta: cause.issues,
    })
  }
}
