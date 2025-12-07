import * as v from 'valibot'
import type { IncomingHttpHeaders } from 'node:http'
import type { UnknownSchema, UnknownIssue } from './types'
import { ErrorCodeSchema } from './schemas'

interface ResponseErrorOptions<Meta = unknown> {
  headers?: Headers | IncomingHttpHeaders
  payload?: unknown
  method?: string
  cause?: unknown
  meta?: Meta
  url?: URL
  id?: string
}

export abstract class ResponseError<Meta = unknown> extends Error {
  name = 'ResponseError'
  expose = true

  readonly code: unknown
  readonly status: number

  message: string
  description?: string
  headers?: Headers | IncomingHttpHeaders
  payload?: unknown
  method?: string
  cause?: unknown
  meta: Meta
  url?: URL
  id?: string

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
  readonly status = 400

  message = '👎 Bad request'
}

export class UnauthorizedError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.UNAUTHORIZED
  readonly status = 401

  message = '🙅‍♂️ Unauthorized'
}

export class ForbiddenError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.FORBIDDEN
  readonly status = 403

  message = '✋ Denied'
}

export class NotFoundError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.NOT_FOUND
  readonly status = 404

  message = '🤷‍♂️ Not found'
}

export class NotAcceptableError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.NOT_ACCEPTABLE
  readonly status = 406

  message = '👀 What is it?'
}

export class ConflictError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.CONFLICT
  readonly status = 409

  message = '🙅‍♂️ Already exists'
}

export class InternalServerError<Meta = unknown> extends ResponseError<Meta> {
  readonly code = ErrorCodeSchema.enum.INTERNAL_SERVER_ERROR
  readonly status = 500

  message = '😭 Something went wrong'
}

export class ParsingError extends ResponseError<UnknownIssue[]> {
  readonly code = ErrorCodeSchema.enum.PARSING_ERROR
  readonly status = 400

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
  readonly status = 409

  message = '🙅‍♂️ Already refreshed'
}
