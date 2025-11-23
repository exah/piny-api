import { NotFound } from '@piny/error'
import { SessionEntity } from '@piny/session/entities'
import { UserEntity } from './entities'
import type { UserType } from './types'

export function getSessionUserType(
  session: SessionEntity,
  user: UserEntity
): UserType {
  return session.user.id === user.id ? 'current' : 'other'
}

export async function getUserByName(name: string): Promise<UserEntity> {
  const user = await UserEntity.findOne({
    where: { name },
    select: ['id', 'name', 'email'],
  })

  if (user === null) {
    throw new NotFound('User not found')
  }

  return user
}
