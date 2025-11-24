import { SessionEntity } from './entities'
import { createToken, getTokenExpiration } from './utils'

export async function createRefreshedSession(
  previousSession: SessionEntity
): Promise<SessionEntity> {
  const expiration = getTokenExpiration()

  const token = await createToken(previousSession.user.name, expiration)
  const refreshedSession = SessionEntity.create({
    token,
    expiration,
    user: previousSession.user,
  })

  await refreshedSession.save()

  previousSession.expiration = Date.now()
  await previousSession.save()

  return refreshedSession
}
