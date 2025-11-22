import { User } from '@piny/user/entities'
import type { RouterContext } from '@piny/api/types/router'
import { Forbidden, NotFound } from '@piny/error'
import { Tag } from './entities'

export async function all({
  response,
  params,
  state,
}: RouterContext<never, { user: string }>) {
  let user: User

  if (params.user) {
    const foundUser = await User.findOne({
      where: { name: params.user },
      select: ['id'],
    })

    if (foundUser == null) {
      throw new NotFound()
    }

    user = foundUser
  } else if (state.session) {
    user = state.session.user
  } else {
    throw new Forbidden()
  }

  const tags = await Tag.find({
    where: { users: [{ name: user.name }] },
    select: ['id', 'name'],
  })

  response.body = tags
}
