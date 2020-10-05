import { RouterContext } from '../types'
import { User } from '../entities/user'

export const UserTagController = {
  async get({ response, params }: RouterContext<{ user: string }>) {
    try {
      const user = await User.findOne(
        { name: params.user },
        { select: ['id'], relations: ['tags'] }
      )

      if (user?.tags?.length) {
        response.body = user.tags
      } else {
        response.body = []
      }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
}
