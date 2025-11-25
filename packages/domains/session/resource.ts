import { assert } from '@piny/tools/assert'
import { Unauthorized, Forbidden } from '@piny/status/errors'
import type { RouterContext } from '@piny/api/types/router'
import type { MessageResponse } from '@piny/status/types'
import {
  createUser,
  createSession,
  createRefreshedSession,
  removeSession,
} from './functions'
import type { TokenResponse } from './types'
import { TokenResponseSchema } from './schemas'
import { getPrefixedToken } from './utils'
import { LoginPayloadSchema, SignupPayloadSchema } from './schemas'

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

  assert(token, new Unauthorized())
  await removeSession(token)

  reply(200, '👋 Bye')
}

export async function signup({
  receive,
  reply,
}: RouterContext<MessageResponse>) {
  const body = await receive(SignupPayloadSchema)

  await createUser(body)

  reply(200, '👋 Welcome, please /login')
}

export async function refreshSession({
  state,
  reply,
}: RouterContext<TokenResponse>) {
  assert(state.session, new Forbidden())

  const session = await createRefreshedSession(state.session)

  reply(200, TokenResponseSchema, { token: session.token })
}
