import type { Next } from 'koa'
import { getSessionFromRequest } from '@piny/session/functions'
import type { RouterContext } from '../types/router'

export async function getSessionContext(context: RouterContext<never>, next: Next) {
  const session = await getSessionFromRequest(context.request)

  if (session !== null) {
    context.state.session = session
  } else {
    delete context.state.session
  }

  return next()
}
