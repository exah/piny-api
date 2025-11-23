import type { UserEntity } from '@piny/user/entities'
import type { UserType } from '@piny/user/types'
import { match } from 'lil-match'
import { Privacy } from '@piny/bookmark/constants'
import { TagEntity } from './entities'

export async function getUserTags(user: UserEntity, type: UserType) {
  const tags = await TagEntity.find({
    select: ['id', 'name'],
    where: {
      users: [{ id: user.id }],
      bookmarks: match(type)
        .with('other', () => [{ privacy: Privacy.public }])
        .with('current', () => [])
        .exhaustive('Unhandled user type'),
    },
  })

  return tags
}
