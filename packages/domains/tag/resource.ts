import { UserEntity } from '@piny/user/entities'
import type { RouterContext } from '@piny/api/types/router'
import { NotFound } from '@piny/status/errors'
import { getSessionUserType, getUserByName } from '@piny/user/functions'
import type { UserType, UserParams } from '@piny/user/types'
import { ensure } from '@piny/tools/assert'
import { getUserTags } from './functions'
import type { TagsListResponse, Tag } from './types'

export async function getTags({
  response,
  params,
  state,
}: RouterContext<TagsListResponse, UserParams>) {
  let user: UserEntity
  if (params.user) {
    user = await getUserByName(params.user)
  } else {
    user = ensure(state.session).user
  }

  const userType: UserType = state.session
    ? getSessionUserType(state.session, user)
    : 'other'

  const tags = await getUserTags(user, userType)

  if (tags.length === 0 && userType === 'other') {
    throw new NotFound()
  }

  response.body = tags.map((tag): Tag => ({ id: tag.id, name: tag.name }))
}
