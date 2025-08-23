import { RouterContext } from '../types/router'
import { Tag } from '../entities/tag'
import { Session } from '../entities/session'
import { User } from '../entities/user'
import { Denied, NotFound } from '../utils/errors'

interface SessionState {
  session: Session
}

export async function all({
  response,
  params,
  state,
}: RouterContext<{ user: string }, Partial<SessionState>>) {
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
