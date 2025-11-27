import { assert } from '@piny/tools/assert'
import { UnauthorizedError, ForbiddenError } from '@piny/status/errors'
import type { RouterContext } from '@piny/api/types/router'
import type { MessageResponse } from '@piny/status/types'
import { CreateUserPayloadSchema } from '@piny/user/schemas'
import {
  createUser,
  createSession,
  createRefreshedSession,
  removeSession,
} from './functions'
import type { TokenResponse } from './types'
import { TokenResponseSchema } from './schemas'
import { getPrefixedToken } from './utils'
import { LoginPayloadSchema } from './schemas'

export async function login({ receive, reply }: RouterContext<TokenResponse>) {
  const body = await receive(LoginPayloadSchema)
  const session = await createSession(body)

  reply(200, TokenResponseSchema, { token: session.token })
}

export async function logout({
  request,
  reply,
}: RouterContext<MessageResponse>) {
  const token = await getPrefixedToken(request.get('Authorization'))

  assert(token, new UnauthorizedError())
  await removeSession(token)

  reply(200, '👋 Bye')
}

export async function signup({
  receive,
  reply,
}: RouterContext<MessageResponse>) {
  const body = await receive(CreateUserPayloadSchema)

  await createUser(body)

  reply(200, '👋 Welcome, please /login')
}

export async function refreshSession({
  state,
  reply,
}: RouterContext<TokenResponse>) {
  assert(state.session, new ForbiddenError())

  const session = await createRefreshedSession(state.session)

  reply(200, TokenResponseSchema, { token: session.token })
}
