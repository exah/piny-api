import { RouterContext } from '../types/router'
import { Session } from '../entities/session'
import { NotFound } from '../utils/errors'
import { User } from '../entities/user'

interface SessionState {
  session: Session
}

export async function get({
  response,
  params,
  state,
}: RouterContext<{ user: string }, SessionState>) {
  const select: (keyof User)[] = ['id', 'name']

  if (state.session.user.name === params.user) {
    select.push('email')
  }

  const user = await User.findOne({
    where: { name: params.user },
    select,
  })

  if (user === null) {
    throw new NotFound('User not found')
  }

  const exposedUser: Partial<User> = { ...user }

  if (state.session.user.id !== user.id) {
    delete exposedUser.email
  }

  response.body = exposedUser
}
