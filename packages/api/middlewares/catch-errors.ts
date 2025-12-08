import type { Next } from 'koa'
import * as v from 'valibot'
import * as Sentry from '@sentry/node'
import { InternalServerError, ParsingError } from '@piny/status/errors'
import { createErrorId, isResponseError } from '@piny/status/utils'
import type { RegisteredResponseError, ErrorResponse } from '@piny/status/types'
import { ErrorResponseSchema } from '@piny/status/schemas'
import type { RouterContext } from '../types/router'

function getResponseError(error: unknown): RegisteredResponseError {
  if (v.isValiError(error)) {
    return new ParsingError(error)
  } else if (isResponseError(error)) {
    return error
  } else {
    return new InternalServerError(undefined, { cause: error })
  }
}

export async function catchErrors(context: RouterContext<ErrorResponse>, next: Next) {
  try {
    await next()
  } catch (error) {
    const id = await createErrorId()
    const responseError = getResponseError(error)

    responseError.id = id
    responseError.url = context.url
    responseError.expose = true
    responseError.method = context.method
    responseError.headers = context.headers

    context.reply(responseError.status, ErrorResponseSchema, {
      id,
      code: responseError.code,
      meta: responseError.meta,
      message: responseError.description || responseError.message,
      requestId: context.requestId,
    })

    Sentry.captureException(error, {
      mechanism: {
        handled: responseError.status !== 500,
        type: 'piny.middleware.catch-errors',
      },
    })

    context.app.emit('error', responseError, context)
  }
}
