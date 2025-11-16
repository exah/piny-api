import * as Time from '../constants/time'
import { Session } from '../entities/session'
import { createToken } from '../utils/auth'
import { createUserMock } from './user'

interface SessionMock extends Partial<Pick<Session, 'user' | 'expiration'>> {}

export async function createSessionMock({
  user: mockedUser,
  expiration = Date.now() + Time.DAY,
}: SessionMock = {}) {
  const user = mockedUser ?? (await createUserMock())
  const session = Session.create({
    user,
    token: await createToken(user.name, expiration),
    expiration,
  })

  return session.save()
}
