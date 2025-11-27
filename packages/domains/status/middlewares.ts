import { Next } from 'koa'
import * as v from 'valibot'
import { RouterContext } from '@piny/api/types/router'
import { BadRequestError, InternalServerError } from './errors'
import { createErrorId, isResponseError } from './utils'
import type { ErrorResponse } from './types'

function getReadableIssueMessage(issue: v.BaseIssue<unknown>) {
  return issue.path
    ? `'${issue.path.map((path) => path.key).join(',')}:' ${issue.message}`
    : issue.message
}

function getResponseError(error: unknown) {
  if (v.isValiError(error)) {
    return new BadRequestError(
      `🤦‍♂️ Bad request: ${error.issues.map(getReadableIssueMessage).join(', ')}`,
      { cause: error, meta: error.issues }
    )
  } else if (isResponseError(error)) {
    return error
  } else {
    return new InternalServerError(undefined, { cause: error })
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
