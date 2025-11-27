import { NotFoundError, UnauthorizedError } from '@piny/status/errors'
import { assert, ensure } from '@piny/tools/assert'
import { SessionEntity } from '@piny/session/entities'
import { UserEntity } from './entities'
import type { UserType, UserName } from './types'

export function getSessionUserType(
  session: SessionEntity,
  user: UserEntity
): UserType {
  return session.user.id === user.id ? 'current' : 'other'
}

export async function getUserByName(name: UserName): Promise<UserEntity> {
  const user = await UserEntity.findOne({
    where: { name },
    select: ['id', 'name', 'email'],
  })

  assert(user, new NotFoundError('User not found'))
  return user
}

export async function getSessionUser(
  session?: SessionEntity,
  name?: UserName
): Promise<[UserEntity, UserType]> {
  let user: UserEntity
  if (name) {
    user = await getUserByName(name)
  } else {
    user = ensure(session, new UnauthorizedError()).user
  }

  const userType: UserType = session
    ? getSessionUserType(session, user)
    : 'other'

  return [user, userType]
}
