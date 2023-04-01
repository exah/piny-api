import { RouterContext } from '../types/router'
import { User } from '../entities/user'

export async function all({
  response,
  params,
}: RouterContext<{ user: string }>) {
  const user = await User.findOne({
    where: { name: params.user },
    select: ['id'],
    relations: { tags: true },
  })

  if (user?.tags?.length) {
    response.body = user.tags
  } else {
    response.body = []
  }
}
