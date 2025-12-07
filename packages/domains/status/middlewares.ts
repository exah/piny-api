import type { Next } from 'koa'
import * as v from 'valibot'
import { RouterContext } from '@piny/api/types/router'
import { InternalServerError, ParsingError } from './errors'
import { createErrorId, isResponseError } from './utils'
import type { RegisteredResponseError, ErrorResponse } from './types'
import { ErrorResponseSchema } from './schemas'

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
    responseError.url = context.URL
    responseError.method = context.method
    responseError.headers = context.headers

    context.reply(responseError.status, ErrorResponseSchema, {
      id,
      code: responseError.code,
      meta: responseError.meta,
      message: responseError.description || responseError.message,
    })

    context.app.emit('error', responseError, context)
  }
}
