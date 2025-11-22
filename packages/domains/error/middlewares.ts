import { Context, Next } from 'koa'
import { isValiError } from 'valibot'
import crypto from 'crypto'
import { BadRequest, SomethingWentWrong } from './errors'
import { isResponseError } from './utils'

function getResponseError(error: unknown) {
  if (isValiError(error)) {
    return new BadRequest(
      `🤦‍♂️ Bad request: ${error.issues
        .map((issue) => issue.message)
        .join(', ')}`,
      { cause: error, meta: error.issues }
    )
  } else if (isResponseError(error)) {
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
    const responseError = getResponseError(error)

    context.throw(responseError.status, {
      id,
      code: responseError.code,
      meta: responseError.meta,
      message: responseError.description || responseError.message,
    })
  }
}
