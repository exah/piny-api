import { UserEntity } from '@piny/user/entities'
import type { RouterContext } from '@piny/api/types/router'
import { Forbidden, NotFound } from '@piny/error'
import type { TagsListResponse, Tag } from './types'
import { getUserTags } from './functions'

export async function getTags({
  response,
  params,
  state,
}: RouterContext<TagsListResponse, { user?: string }>) {
  let user: UserEntity

  if (params.user) {
    const foundUser = await UserEntity.findOne({
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

  const tags = await getUserTags(user)
  response.body = tags.map((tag): Tag => ({ id: tag.id, name: tag.name }))
}
