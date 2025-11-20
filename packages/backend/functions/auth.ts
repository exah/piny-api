import parse from 'co-body'

import { BadRequest, NotAuthorized, NotFound, Denied } from '../utils/errors'
import { hash, createToken, validateToken } from '../utils/auth'
import * as Time from '../constants/time'
import { User } from '../entities/user'
import { Session } from '../entities/session'
import { RouterContext } from '../types/router'

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

async function getSession(input: string | null) {
  const token = getToken(input)

  if (typeof token === 'string' && (await validateToken(token))) {
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
  { request, state }: RouterContext<never, { session?: Session }>,
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
  { request, state }: RouterContext<never, { session?: Session }>,
  next: () => Promise<void>
) {
  const session = await getSession(request.get('Authorization'))

  if (session !== null) {
    state.session = session
    return next()
  } else {
    delete state.session
  }

  throw new NotAuthorized()
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

  const expiration = Date.now() + 4 * Time.WEEK
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
