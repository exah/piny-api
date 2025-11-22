import { Session } from '@piny/session/entities'
import { Unauthorized } from '@piny/error'
import type { RouterContext } from '@piny/api/types/router'
import { getPrefixedToken, validateToken } from './utils'

async function getSession(input: string | null) {
  const token = await getPrefixedToken(input)

  if (token !== null && (await validateToken(token))) {
    const session = await Session.findOne({
      where: { token },
      relations: { user: true },
    })

    if (session && session.expiration > Date.now()) {
      return session
    }
  }

  return null
}

export async function session(
  { request, state }: RouterContext<never>,
  next: () => Promise<void>
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
  next: () => Promise<void>
) {
  const session = await getSession(request.get('Authorization'))

  if (session !== null) {
    state.session = session
    return next()
  } else {
    delete state.session
  }

  throw new Unauthorized()
}
