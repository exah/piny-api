import { RouterContext } from '../types'
import { User } from '../entities/user'

export const UserController = {
  async get({ response, params }: RouterContext<{ user: string }>) {
    const user = await User.findOne(
      { name: params.user },
      { select: ['id', 'name', 'email'] }
    )

    response.body = user
  },
}
