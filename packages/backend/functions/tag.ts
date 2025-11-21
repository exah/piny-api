import { Tag } from '@piny/tag/entity'
import { User } from '@piny/user/entity'
import { RouterContext } from '../types/router'
import { Denied, NotFound } from '../utils/errors'

export async function all({
  response,
  params,
  state,
}: RouterContext<{ user: string }>) {
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
    throw new Denied()
  }

  const tags = await Tag.find({
    where: { users: [{ name: user.name }] },
    select: ['id', 'name'],
  })

  response.body = tags
}
