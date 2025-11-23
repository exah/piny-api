import { match } from 'lil-match'
import { assert } from '@piny/tools/assert'
import type { RouterContext } from '@piny/api/types/router'
import type { User, UserParams } from './types'
import { UserSchema } from './schemas'
import { getSessionUserType, getUserByName } from './functions'

export async function getUser({
  params,
  state,
  reply,
}: RouterContext<User, UserParams>) {
  assert(state.session)
  assert(params.user)

  const user = await getUserByName(params.user)
  const data = match(getSessionUserType(state.session, user))
    .with('current', (type) => ({
      id: user.id,
      type,
      name: user.name,
      email: user.email,
    }))
    .with('other', (type) => ({
      id: user.id,
      type,
      name: user.name,
    }))
    .exhaustive('Invalid user type')

  reply(200, UserSchema, data)
}
