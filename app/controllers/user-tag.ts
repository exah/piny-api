import { RouterContext } from '../types'
import { User } from '../entities/user'

export const UserTagController = {
  async all({ response, params }: RouterContext<{ user: string }>) {
    const user = await User.findOne(
      { name: params.user },
      { select: ['id'], relations: ['tags'] }
    )

    if (user?.tags?.length) {
      response.body = user.tags
    } else {
      response.body = []
    }
  },
}
