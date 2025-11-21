import { Time } from '@piny/tools/constants'
import { createUserMock } from '@piny/user/mocks'
import { Session } from './entities'
import { createToken } from './utils'

interface SessionMock extends Partial<Pick<Session, 'user' | 'expiration'>> {}

export async function createSessionMock({
  user: mockedUser,
  expiration = Date.now() + Time.HOUR,
}: SessionMock = {}) {
  const user = mockedUser ?? (await createUserMock())
  const token = await createToken(user.name, expiration)

  const session = Session.create({
    user,
    token,
    expiration,
  })

  return session.save()
}
