import type { UserEntity } from '@piny/user/entities'
import { TagEntity } from './entities'

export function getUserTags(user: UserEntity) {
  return TagEntity.find({
    where: { users: [{ id: user.id }] },
    select: ['id', 'name'],
  })
}
