import type { Next } from 'koa'
import { assert } from '@piny/tools/assert'
import { UnauthorizedError } from '@piny/status/errors'
import type { RouterContext } from '../types/router'

export async function authorized(context: RouterContext<never>, next: Next) {
  assert(context.state.session, new UnauthorizedError())
  return next()
}
