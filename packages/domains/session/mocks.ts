import { createUserMock } from '@piny/user/mocks'
import { SessionEntity } from './entities'
import { createToken, getTokenExpiration } from './utils'

interface SessionMock
  extends Partial<Pick<SessionEntity, 'user' | 'expiration'>> {}

export async function createSessionMock({
  user: mockedUser,
  expiration = getTokenExpiration(),
}: SessionMock = {}) {
  const user = mockedUser ?? (await createUserMock())
  const token = await createToken(user.name, expiration)

  const session = SessionEntity.create({
    user,
    token,
    expiration,
  })

  return session.save()
}
