import { NotFoundError, UnauthorizedError, ForbiddenError } from '@piny/status/errors'
import { assert, ensure } from '@piny/tools/assert'
import { manager } from '@piny/db/transaction'
import { SessionEntity } from '@piny/session/entities'
import { UserEntity } from './entities'
import { hash } from '@piny/session/utils'
import type { UserType, UserName, CreateUserPayload } from './types'

export async function createUser(payload: CreateUserPayload) {
  const nameCount = await UserEntity.count({
    where: { name: payload.user },
  })

  if (nameCount > 0) {
    throw new ForbiddenError('👯‍♀️ Use different `user`')
  }

  const emailCount = await UserEntity.count({
    where: { email: payload.email },
  })

  if (emailCount > 0) {
    throw new ForbiddenError('💌 Use different `email`')
  }

  const user = UserEntity.create({
    name: payload.user,
    email: payload.email,
    pass: hash(payload.user, payload.pass),
  })

  await manager().save(user)
}

export function getSessionUserType(session: SessionEntity, user: UserEntity): UserType {
  return session.user.id === user.id ? 'current' : 'other'
}

export async function getUserByName(name: UserName): Promise<UserEntity> {
  const user = await manager().findOne(UserEntity, {
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

  const userType: UserType = session ? getSessionUserType(session, user) : 'other'

  return [user, userType]
}
