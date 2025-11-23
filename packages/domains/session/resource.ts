import parse from 'co-body'
import * as v from 'valibot'
import { UserEntity } from '@piny/user/entities'
import { assert } from '@piny/tools/assert'
import { Unauthorized, NotFound, Forbidden } from '@piny/error'
import type { RouterContext } from '@piny/api/types/router'
import { SessionEntity } from './entities'
import { createRefreshedSession } from './functions'
import { hash, createToken, getTokenExpiration } from './utils'
import type { TokenResponse, MessageResponse } from './types'
import {
  LoginPayloadSchema,
  SignupPayloadSchema,
  SessionTokenSchema,
} from './schemas'

const parseLoginPayload = v.parserAsync(LoginPayloadSchema)
const parseSignupPayload = v.parserAsync(SignupPayloadSchema)
const parseSessionToken = v.parserAsync(SessionTokenSchema)

async function getToken(input: string | null, prefix = 'Bearer ') {
  if (input?.startsWith(prefix)) {
    return parseSessionToken(input.slice(prefix.length))
  }

  return null
}

export async function login({
  request,
  response,
}: RouterContext<TokenResponse>) {
  const body = await parseLoginPayload(await parse.json(request))

  const user = await UserEntity.findOne({
    where: { name: body.user },
    select: ['id', 'pass'],
    relations: { sessions: true },
  })

  if (user == null) {
    throw new NotFound()
  }

  if (user.pass !== hash(body.user, body.pass)) {
    throw new Forbidden()
  }

  const expiration = getTokenExpiration()
  const token = await createToken(user.name, expiration)

  await SessionEntity.create({ token, expiration, user }).save()

  response.status = 200
  response.body = { token }
}

export async function logout({
  request,
  response,
}: RouterContext<MessageResponse>) {
  const token = await getToken(request.get('Authorization'))

  if (token === null) {
    throw new Unauthorized()
  }

  const session = await SessionEntity.findOne({
    where: { token },
  })

  if (!session) {
    throw new NotFound()
  }

  await SessionEntity.remove(session)

  response.body = { message: '👋 Bye' }
}

export async function signup({
  request,
  response,
}: RouterContext<MessageResponse>) {
  const body = await parseSignupPayload(await parse.json(request))

  const nameCount = await UserEntity.count({
    where: { name: body.user },
  })

  if (nameCount > 0) {
    throw new Forbidden('👯‍♀️ Use different `user`')
  }

  const emailCount = await UserEntity.count({
    where: { email: body.email },
  })

  if (emailCount > 0) {
    throw new Forbidden('💌 Use different `email`')
  }

  const user = UserEntity.create({
    name: body.user,
    email: body.email,
    pass: hash(body.user, body.pass),
  })

  await user.save()

  response.status = 200
  response.body = { message: '👋 Welcome, please /login' }
}

export async function refreshSession({
  response,
  state,
}: RouterContext<TokenResponse>) {
  assert(state.session)

  const session = await createRefreshedSession(state.session)

  response.status = 200
  response.body = { token: session.token }
}
