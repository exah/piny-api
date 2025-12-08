import * as v from 'valibot'
import { StatusCodes } from 'http-status-codes'
import type { IncomingHttpHeaders } from 'node:http'
import type { UnknownSchema, UnknownIssue, ErrorId } from './types'
import { ErrorCodeSchema } from './schemas'

interface ResponseErrorOptions<Meta = unknown> {
  requestId?: string
  headers?: Headers | IncomingHttpHeaders
  payload?: unknown
  method?: string
  cause?: unknown
  meta?: Meta
  url?: string
  id?: ErrorId
}

export abstract class ResponseError<Meta = unknown> extends Error {
  name = 'ResponseError'

  readonly code: unknown
  readonly status: number

  message: string
  expose?: boolean
  description?: string
  requestId?: string
  headers?: Headers | IncomingHttpHeaders
  payload?: unknown
  method?: string
  cause?: unknown
  meta: Meta
  url?: string
  id?: ErrorId

  constructor(description?: string, options?: ResponseErrorOptions<Meta>) {
    super()

    if (description) this.description = description
    if (options?.headers) this.headers = options.headers
    if (options?.payload) this.payload = options.payload
    if (options?.method) this.method = options.method
    if (options?.cause) this.cause = options.cause
    if (options?.meta) this.meta = options.meta
    if (options?.url) this.url = options.url
    if (options?.id) this.id = options.id
  }
}

export class BadRequestError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.BAD_REQUEST
  readonly status = StatusCodes.BAD_REQUEST

  name = 'BadRequestError'
  message = '👎 Bad request'
}

export class UnauthorizedError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.UNAUTHORIZED
  readonly status = StatusCodes.UNAUTHORIZED

  name = 'UnauthorizedError'
  message = '🙅‍♂️ Unauthorized'
}

export class ForbiddenError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.FORBIDDEN
  readonly status = StatusCodes.FORBIDDEN

  name = 'ForbiddenError'
  message = '✋ Denied'
}

export class NotFoundError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.NOT_FOUND
  readonly status = StatusCodes.NOT_FOUND

  name = 'NotFoundError'
  message = '🤷‍♂️ Not found'
}

export class NotAcceptableError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.NOT_ACCEPTABLE
  readonly status = StatusCodes.NOT_ACCEPTABLE

  name = 'NotAcceptableError'
  message = '👀 What is it?'
}

export class ConflictError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.CONFLICT
  readonly status = StatusCodes.CONFLICT

  name = 'ConflictError'
  message = '🙅‍♂️ Already exists'
}

export class InternalServerError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.INTERNAL_SERVER_ERROR
  readonly status = StatusCodes.INTERNAL_SERVER_ERROR

  name = 'InternalServerError'
  message = '😭 Something went wrong'
}

export class ParsingError extends ResponseError<UnknownIssue[]> {
  readonly code = ErrorCodeSchema.enum.PARSING_ERROR
  readonly status = StatusCodes.BAD_REQUEST

  name = 'ParsingError'
  message = '🤦‍♂️ Parsing error'

  constructor(cause: v.ValiError<UnknownSchema>)
  constructor(message?: string, options?: ResponseErrorOptions<UnknownIssue[]>)
  constructor(
    input?: v.ValiError<UnknownSchema> | string,
    options?: ResponseErrorOptions<UnknownIssue[]>
  ) {
    if (!v.isValiError(input)) {
      super(input, options)
      return
    }

    const reasons = input.issues.map((issue) => {
      if (!issue.path) {
        return issue.message
      }

      return `'${issue.path.map((item) => item.key).join('.')}': ${issue.message}`
    })

    super(`🤦‍♂️ Parsing error:\n${reasons.join('\n')}`, {
      cause: input,
      meta: input.issues,
    })
  }
}

export class SessionAlreadyRefreshedError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.SESSION_ALREADY_REFRESHED
  readonly status = StatusCodes.CONFLICT

  name = 'SessionAlreadyRefreshedError'
  message = '🙅‍♂️ Already refreshed'
}
