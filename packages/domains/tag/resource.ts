import { UserEntity } from '@piny/user/entities'
import type { RouterContext } from '@piny/api/types/router'
import { NotFoundError } from '@piny/status/errors'
import { getSessionUserType, getUserByName } from '@piny/user/functions'
import type { UserType, UserParams } from '@piny/user/types'
import { ensure } from '@piny/tools/assert'
import { getUserTags } from './functions'
import { TagsListResponseSchema } from './schemas'
import type { TagsListResponse } from './types'

export async function getTags({
  params,
  state,
  reply,
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
    throw new NotFoundError()
  }

  reply(200, TagsListResponseSchema, tags)
}
