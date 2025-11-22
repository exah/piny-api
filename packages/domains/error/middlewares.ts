import { Context, Next } from 'koa'
import { isValiError } from 'valibot'
import crypto from 'crypto'
import { ResponseError, BadRequest, SomethingWentWrong } from './errors'
import type { ResponseErrorVariant } from './errors'

function getResponseError(error: unknown): ResponseErrorVariant {
  if (isValiError(error)) {
    return new BadRequest(
      `🤦‍♂️ Bad request: ${error.issues
        .map((issue) => issue.message)
        .join(', ')}`,
      { cause: error, meta: error.issues }
    )
  } else if (error instanceof ResponseError) {
    return error
  } else {
    return new SomethingWentWrong(undefined, { cause: error })
  }
}

export async function catchErrors(context: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    const id = crypto.randomUUID()
    const responseError = Object.assign(getResponseError(error), {
      id,
      url: context.request.URL,
    })

    if (process.env.NODE_ENV !== 'test') {
      console.error(responseError)
    }

    context.status = responseError.status
    context.body = {
      id,
      code: responseError.code,
      meta: responseError.meta,
      message: responseError.description || responseError.message,
    }
  }
}
