import type { Next } from 'koa'
import { SessionEntity } from '@piny/session/entities'
import { UnauthorizedError } from '@piny/status/errors'
import type { RouterContext } from '@piny/api/types/router'
import { getPrefixedToken, validateToken } from './utils'

async function getSession(input: string | null) {
  const token = await getPrefixedToken(input)

  if (token !== null && (await validateToken(token))) {
    const session = await SessionEntity.findOne({
      where: { token },
      relations: { user: true },
    })

    if (session && session.expiresAt.getTime() > Date.now()) {
      return session
    }
  }

  return null
}

export async function session(
  { request, state }: RouterContext<never>,
  next: Next
) {
  const session = await getSession(request.get('Authorization'))

  if (session !== null) {
    state.session = session
  } else {
    delete state.session
  }

  return next()
}

export async function verify(
  { request, state }: RouterContext<never>,
  next: Next
) {
  const session = await getSession(request.get('Authorization'))

  if (session != null) {
    state.session = session
    return next()
  } else {
    delete state.session
  }

  throw new UnauthorizedError()
}
