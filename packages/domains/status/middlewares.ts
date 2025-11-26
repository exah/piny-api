import { Next } from 'koa'
import { isValiError } from 'valibot'
import { RouterContext } from '@piny/api/types/router'
import { BadRequest, SomethingWentWrong } from './errors'
import { createErrorId, isResponseError } from './utils'
import type { ErrorResponse } from './types'

function getResponseError(error: unknown) {
  if (isValiError(error)) {
    return new BadRequest(
      `🤦‍♂️ Bad request: ${error.issues
        .map((issue) =>
          issue.path
            ? `${issue.path.join(',')} ${issue.message}`
            : issue.message
        )
        .join(', ')}`,
      { cause: error, meta: JSON.stringify(error.issues) }
    )
  } else if (isResponseError(error)) {
    return error
  } else {
    return new SomethingWentWrong(undefined, { cause: error })
  }
}

export async function catchErrors(
  context: RouterContext<ErrorResponse>,
  next: Next
) {
  try {
    await next()
  } catch (error) {
    const id = await createErrorId()
    const responseError = getResponseError(error)

    context.response.status = responseError.status
    context.response.body = {
      id,
      code: responseError.code,
      meta: responseError.meta,
      message: responseError.description || responseError.message,
    }

    context.app.emit('error', responseError, context)
  }
}
