import type { RouterContext } from '@piny/api/types/router'
import { NotFoundError } from '@piny/status/errors'
import { getSessionUser } from '@piny/user/functions'
import type { UserParams } from '@piny/user/types'
import { getUserTags } from './functions'
import { TagsListResponseSchema } from './schemas'
import type { TagsListResponse } from './types'

export async function getTags({
  params,
  state,
  reply,
}: RouterContext<TagsListResponse, UserParams>) {
  const [user, userType] = await getSessionUser(state.session, params.user)
  const tags = await getUserTags(user, userType)

  if (tags.length === 0 && userType === 'other') {
    throw new NotFoundError()
  }

  reply(200, TagsListResponseSchema, tags)
}
