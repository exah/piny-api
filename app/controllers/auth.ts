import { Context, RouterContext, Body } from 'https://deno.land/x/oak/mod.ts'
import { hash, jwt, validate } from '../utils.ts'
import { User } from '../entities/user.ts'

interface AuthBody {
  type: 'json'
  value: {
    user: string
    pass: string
  }
}

function getToken(input: string | null, prefix = 'Bearer ') {
  if (input?.startsWith(prefix)) {
    return input.slice(prefix.length)
  }

  return null
}

function assertAuthBody(input: Body): asserts input is AuthBody {
  if (input.type === 'json' && input.value?.user && input.value?.pass) return
  throw new Error('request `body` should contain `user` and `pass`')
}

export const AuthController = {
  async verify({ request, response }: Context, next: () => Promise<void>) {
    const token = getToken(request.headers.get('Authorization'))

    if (await validate(token)) {
      const count = await User.count({
        where: `user.token LIKE '%${token}%'`,
      })

      if (count === 1) {
        return next()
      }
    }

    response.status = 401
    response.body = { message: '🙅‍♂️ Not authorized' }
  },
  async login({ request, response }: RouterContext<never>) {
    try {
      const body = await request.body({
        contentTypes: {
          json: ['application/json'],
        },
      })

      assertAuthBody(body)

      const user = await User.findOne(
        { name: body.value.user },
        { select: ['id', 'pass', 'token'] }
      )

      if (user == null) {
        response.status = 400
        response.body = { message: '🤷‍♂️ Not found' }
        return
      }

      if (user.pass !== hash(body.value.pass)) {
        response.status = 403
        response.body = { message: '✋ Denied' }
        return
      }

      const token = jwt(user.name)
      await User.update(user.id, { token: [...user.token, token] })

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
      if (!token) throw new Error('Authorization header not valid')

      const user = await User.findOne({
        where: `user.token LIKE '%${token}%'`,
        select: ['id', 'token'],
      })

      if (!user) {
        response.status = 404
        response.body = { message: '🤷‍♂️ Not found' }
        return
      }

      await User.update(user.id, {
        token: user.token.filter((item) => item !== token),
      })

      response.body = { message: '👋 Bye' }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
}
