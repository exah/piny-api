import { createUserMock } from '@piny/user/mocks'
import { SessionEntity } from './entities'
import { createToken, getTokenExpiration } from './utils'

interface SessionMock
  extends Partial<Pick<SessionEntity, 'user' | 'expiresAt'>> {}

export async function createSessionMock({
  user: mockedUser,
  expiresAt = getTokenExpiration(),
}: SessionMock = {}) {
  const user = mockedUser ?? (await createUserMock())
  const token = await createToken(user.name, expiresAt.getTime())

  const session = SessionEntity.create({
    user,
    token,
    expiresAt,
  })

  return session.save()
}
