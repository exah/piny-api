import { RouterContext } from '../types/router'
import { User } from '../entities/user'

export async function get({
  response,
  params,
}: RouterContext<{ user: string }>) {
  const user = await User.findOne({
    where: { name: params.user },
    select: ['id', 'name', 'email'],
  })

  response.body = user
}
