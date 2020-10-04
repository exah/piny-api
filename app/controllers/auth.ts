import parse from 'co-body'

import { MONTH } from '../constants'
import { hash, createToken, validateToken } from '../utils'
import { RouterContext } from '../types'
import { Session } from '../entities/session'
import { User } from '../entities/user'

interface LoginPayload {
  user: string
  pass: string
}

interface SignupPayload extends LoginPayload {
  email: string
}

function assertLoginPayload(input: unknown): asserts input is LoginPayload {
  if (input && typeof input === 'object' && 'user' in input && 'pass' in input)
    return

  throw new Error('input should container `user` and `pass`')
}

function assertSignupPayload(input: unknown): asserts input is SignupPayload {
  assertLoginPayload(input)

  if ('email' in input) return

  throw new Error('input should container `email`')
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
    const session = await getSession(request.headers.authorization)

    if (session !== null) {
      state.session = session
    } else {
      delete state.session
    }

    return next()
  },
  async verify(
    { request, response, state }: RouterContext<never, { session?: Session }>,
    next: () => Promise<void>
  ) {
    const session = await getSession(request.headers.authorization)

    if (session !== null) {
      state.session = session
      return next()
    } else {
      delete state.session
    }

    response.status = 401
    response.body = { message: '🙅‍♂️ Not authorized' }
  },
  async login({ request, response }: RouterContext) {
    try {
      const body = await parse.json(request)

      assertLoginPayload(body)

      const user = await User.findOne(
        { name: body.user },
        { select: ['id', 'pass'], relations: ['sessions'] }
      )

      if (user == null) {
        response.status = 404
        response.body = { message: '🤷‍♂️ Not found' }
        return
      }

      if (user.pass !== hash(body.user, body.pass)) {
        response.status = 403
        response.body = { message: '✋ Denied' }
        return
      }

      const expiration = Date.now() + MONTH
      const token = await createToken(user.name, expiration)

      await Session.create({ token, expiration, user }).save()

      response.status = 200
      response.body = { token }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async logout({ request, response }: RouterContext) {
    const token = getToken(request.headers.authorization)

    try {
      if (!token) {
        response.status = 400
        response.body = { message: '🤔 Are you sure you authorized?' }
        return
      }

      const session = await Session.findOne({ token })

      if (!session) {
        response.status = 404
        response.body = { message: '🤷‍♂️ Not found' }
        return
      }

      await Session.remove(session)

      response.body = { message: '👋 Bye' }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async signup({ request, response }: RouterContext) {
    try {
      const body = await parse.json(request)

      assertSignupPayload(body)

      const nameCount = await User.count({
        name: body.user,
      })

      if (nameCount > 0) {
        response.status = 403
        response.body = { message: '👯‍♀️ Use different `user`' }
        return
      }

      const emailCount = await User.count({
        email: body.email,
      })

      if (emailCount > 0) {
        response.status = 403
        response.body = { message: '💌 Use different `email`' }
        return
      }

      const user = User.create({
        name: body.user,
        email: body.email,
        pass: hash(body.user, body.pass),
      })

      await user.save()

      response.status = 200
      response.body = { message: '👋 Welcome, please /login' }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
}
