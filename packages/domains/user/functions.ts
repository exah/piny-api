import { NotFound } from '@piny/error'
import { Session } from '@piny/session/entities'
import { User } from './entities'
import type { UserType } from './types'

export function getSessionUserType(session: Session, user: User): UserType {
  return session.user.id === user.id ? 'current' : 'other'
}

export async function getUserByName(name: string): Promise<User> {
  const user = await User.findOne({
    where: { name },
    select: ['id', 'name', 'email'],
  })

  if (user === null) {
    throw new NotFound('User not found')
  }

  return user
}
