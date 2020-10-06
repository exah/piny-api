import parse from 'co-body'

import * as Errors from '../errors'
import { MONTH } from '../constants'
import { User } from '../entities/user'
import { Session } from '../entities/session'
import { RouterContext } from '../types'
import { hash, createToken, validateToken } from '../utils'

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

  throw new Errors.BadRequest(
    `🤦‍♂️ request body should contain 'user' and 'pass'`
  )
}

function assertSignupPayload(body: unknown): asserts body is SignupPayload {
  assertLoginPayload(body)

  if ('email' in body) return

  throw new Errors.BadRequest(`🤦‍♂️ request body should contain 'email'`)
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
    const session = await Session.findOne({ token }, { relations: ['user'] })

    if (session && session.expiration > Date.now()) {
      return session
    }
  }

  return null
}

export const AuthController = {
  async session(
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
  },
  async verify(
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

    throw new Errors.NotAuthorised()
  },
  async login({ request, response }: RouterContext) {
    const body = await parse.json(request)

    assertLoginPayload(body)

    const user = await User.findOne(
      { name: body.user },
      { select: ['id', 'pass'], relations: ['sessions'] }
    )

    if (user == null) {
      throw new Errors.NotFound()
    }

    if (user.pass !== hash(body.user, body.pass)) {
      throw new Errors.Denied()
    }

    const expiration = Date.now() + MONTH
    const token = await createToken(user.name, expiration)

    await Session.create({ token, expiration, user }).save()

    response.status = 200
    response.body = { token }
  },
  async logout({ request, response }: RouterContext) {
    const token = getToken(request.get('Authorization'))

    if (!token) {
      throw new Errors.NotAuthorised()
    }

    const session = await Session.findOne({ token })

    if (!session) {
      throw new Errors.NotFound()
    }

    await Session.remove(session)

    response.body = { message: '👋 Bye' }
  },
  async signup({ request, response }: RouterContext) {
    const body = await parse.json(request)

    assertSignupPayload(body)

    const nameCount = await User.count({
      name: body.user,
    })

    if (nameCount > 0) {
      throw new Errors.Denied('👯‍♀️ Use different `user`')
    }

    const emailCount = await User.count({
      email: body.email,
    })

    if (emailCount > 0) {
      throw new Errors.Denied('💌 Use different `email`')
    }

    const user = User.create({
      name: body.user,
      email: body.email,
      pass: hash(body.user, body.pass),
    })

    await user.save()

    response.status = 200
    response.body = { message: '👋 Welcome, please /login' }
  },
}
