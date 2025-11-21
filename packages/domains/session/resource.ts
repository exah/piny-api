import parse from 'co-body'
import { User } from '@piny/user/entities'
import { assert } from '@piny/tools/assert'
import {
  BadRequest,
  NotAuthorized,
  NotFound,
  Denied,
} from '@piny/error/response'
import type { RouterContext } from '@piny/api/types/router'
import { Session } from './entities'
import { createRefreshedSession } from './functions'
import { hash, createToken, getTokenExpiration } from './utils'

interface LoginPayload {
  user: string
  pass: string
}

interface SignupPayload extends LoginPayload {
  email: string
}

function assertLoginPayload(body: unknown): asserts body is LoginPayload {
  if (body && typeof body === 'object' && 'user' in body && 'pass' in body)
    return

  throw new BadRequest(`🤦‍♂️ request body should contain 'user' and 'pass'`)
}

function assertSignupPayload(body: unknown): asserts body is SignupPayload {
  assertLoginPayload(body)

  if ('email' in body) return

  throw new BadRequest(`🤦‍♂️ request body should contain 'email'`)
}

function getToken(input: string | null, prefix = 'Bearer ') {
  if (input?.startsWith(prefix)) {
    return input.slice(prefix.length)
  }

  return null
}

export async function login({ request, response }: RouterContext) {
  const body = await parse.json(request)

  assertLoginPayload(body)

  const user = await User.findOne({
    where: { name: body.user },
    select: ['id', 'pass'],
    relations: { sessions: true },
  })

  if (user == null) {
    throw new NotFound()
  }

  if (user.pass !== hash(body.user, body.pass)) {
    throw new Denied()
  }

  const expiration = getTokenExpiration()
  const token = await createToken(user.name, expiration)

  await Session.create({ token, expiration, user }).save()

  response.status = 200
  response.body = { token }
}

export async function logout({ request, response }: RouterContext) {
  const token = getToken(request.get('Authorization'))

  if (!token) {
    throw new NotAuthorized()
  }

  const session = await Session.findOne({
    where: { token },
  })

  if (!session) {
    throw new NotFound()
  }

  await Session.remove(session)

  response.body = { message: '👋 Bye' }
}

export async function signup({ request, response }: RouterContext) {
  const body = await parse.json(request)
  assertSignupPayload(body)

  const nameCount = await User.count({
    where: { name: body.user },
  })

  if (nameCount > 0) {
    throw new Denied('👯‍♀️ Use different `user`')
  }

  const emailCount = await User.count({
    where: { email: body.email },
  })

  if (emailCount > 0) {
    throw new Denied('💌 Use different `email`')
  }

  const user = User.create({
    name: body.user,
    email: body.email,
    pass: hash(body.user, body.pass),
  })

  await user.save()

  response.status = 200
  response.body = { message: '👋 Welcome, please /login' }
}

export async function refreshSession({ response, state }: RouterContext) {
  assert(state.session)

  const session = await createRefreshedSession(state.session)

  response.status = 200
  response.body = { token: session.token }
}
