import { Context, RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts'
import { MONTH, JSON_BODY } from '../constants.ts'
import { hash, jwt, validate, assertPayload } from '../utils.ts'
import { Session } from '../entities/session.ts'
import { User } from '../entities/user.ts'

interface LoginPayload {
  user: string
  pass: string
}

interface SignUpPayload {
  user: string
  pass: string
  email: string
}

function getToken(input: string | null, prefix = 'Bearer ') {
  if (input?.startsWith(prefix)) {
    return input.slice(prefix.length)
  }

  return null
}

async function getSession(input: string | null) {
  const token = getToken(input)

  if (typeof token === 'string' && (await validate(token))) {
    const session = await Session.findOne({ token }, { relations: ['user'] })

    if (session && session.expiration > Date.now()) {
      return session
    }
  }

  return null
}

export const AuthController = {
  async session(
    { request, state }: Context<{ session: Session }>,
    next: () => Promise<void>
  ) {
    const session = await getSession(request.headers.get('Authorization'))

    if (session !== null) {
      state.session = session
    } else {
      delete state.session
    }

    return next()
  },
  async verify(
    { request, response, state }: Context<{ session: Session }>,
    next: () => Promise<void>
  ) {
    const session = await getSession(request.headers.get('Authorization'))

    if (session !== null) {
      state.session = session
      return next()
    } else {
      delete state.session
    }

    response.status = 401
    response.body = { message: '🙅‍♂️ Not authorized' }
  },
  async login({ request, response }: RouterContext<never>) {
    try {
      const body = await request.body(JSON_BODY)

      assertPayload<LoginPayload>(
        body,
        (value) => Boolean(value.user && value.pass),
        'request `body` should contain `user` and `pass`'
      )

      const user = await User.findOne(
        { name: body.value.user },
        { select: ['id', 'pass'], relations: ['sessions'] }
      )

      if (user == null) {
        response.status = 404
        response.body = { message: '🤷‍♂️ Not found' }
        return
      }

      if (user.pass !== hash(body.value.user, body.value.pass)) {
        response.status = 403
        response.body = { message: '✋ Denied' }
        return
      }

      const expiration = Date.now() + MONTH
      const token = await jwt(user.name, expiration)

      await Session.create({ token, expiration, user }).save()

      response.status = 200
      response.body = { token }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async logout({ request, response }: RouterContext<never>) {
    const token = getToken(request.headers.get('Authorization'))

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
  async signup({ request, response }: RouterContext<never>) {
    try {
      const body = await request.body(JSON_BODY)

      assertPayload<SignUpPayload>(
        body,
        (value) => Boolean(value.user && value.pass && value.email),
        'request `body` should contain `user`, `pass` and `email`'
      )

      const nameCount = await User.count({
        name: body.value.user,
      })

      if (nameCount > 0) {
        response.status = 403
        response.body = { message: '👯‍♀️ Use different `user`' }
        return
      }

      const emailCount = await User.count({
        email: body.value.email,
      })

      if (emailCount > 0) {
        response.status = 403
        response.body = { message: '💌 Use different `email`' }
        return
      }

      const user = User.create({
        name: body.value.user,
        email: body.value.email,
        pass: hash(body.value.user, body.value.pass),
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
