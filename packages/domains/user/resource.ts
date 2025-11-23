import { match } from 'lil-match'
import { assert } from '@piny/tools/assert'
import type { RouterContext } from '@piny/api/types/router'
import { UserResponse } from './types'
import { getSessionUserType, getUserByName } from './functions'

export async function getUser({
  response,
  params,
  state,
}: RouterContext<UserResponse, { user?: string }>) {
  assert(state.session)
  assert(params.user)

  const user = await getUserByName(params.user)

  response.body = match(getSessionUserType(state.session, user))
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
}
