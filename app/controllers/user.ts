import { RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts'
import { User } from '../entities/user.ts'

export const UserController = {
  async get({ response, params }: RouterContext<{ user: string }>) {
    try {
      const user = await User.findOne(
        { name: params.user },
        { select: ['id', 'name', 'email'] }
      )

      response.body = user
    } catch (error) {
      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
}
