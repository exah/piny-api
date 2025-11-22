import { assert } from '@piny/tools/assert'
import type { RouterContext } from '@piny/api/types/router'
import { NotFound } from '@piny/error'
import { User } from './entities'

export async function get({
  response,
  params,
  state,
}: RouterContext<never, { user: string }>) {
  assert(state.session)

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
