import { Context, RouterContext, Body } from 'https://deno.land/x/oak/mod.ts'
import { MONTH, JSON_BODY } from '../constants.ts'
import { hash, jwt, validate } from '../utils.ts'
import { Session } from '../entities/session.ts'
import { User } from '../entities/user.ts'

function getToken(input: string | null, prefix = 'Bearer ') {
  if (input?.startsWith(prefix)) {
    return input.slice(prefix.length)
  }

  return null
}

interface LoginBody {
  type: 'json'
  value: {
    user: string
    pass: string
  }
}

function assertLoginBody(input: Body): asserts input is LoginBody {
  if (input.type === 'json' && input.value.user && input.value.pass) {
    return
  }

  throw new Error('request `body` should contain `user` and `pass`')
}

interface SignUpBody {
  type: 'json'
  value: {
    user: string
    pass: string
    email: string
  }
}

function assertSignUpBody(input: Body): asserts input is SignUpBody {
  if (
    input.type === 'json' &&
    input.value.user &&
    input.value.pass &&
    input.value.email
  ) {
    return
  }

  throw new Error('request `body` should contain `user` and `pass`')
}

export const AuthController = {
  async verify(
    { request, response, state }: Context<{ session: Session }>,
    next: () => Promise<void>
  ) {
    const token = getToken(request.headers.get('Authorization'))

    if (typeof token === 'string' && (await validate(token))) {
      const session = await Session.findOne({ token }, { relations: ['user'] })

      if (session && session.expiration > Date.now()) {
        state.session = session
        return next()
      }
    }

    response.status = 401
    response.body = { message: '🙅‍♂️ Not authorized' }
  },
  async login({ request, response }: RouterContext<never>) {
    try {
      const body = await request.body(JSON_BODY)

      assertLoginBody(body)

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
      const token = jwt(user.name, expiration)

      await Session.create({ token, expiration, user }).save()

      response.status = 200
      response.body = { token, message: '👋 Hello' }
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

      assertSignUpBody(body)

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
