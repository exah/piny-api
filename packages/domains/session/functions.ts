import { Session } from './entities'
import { createToken, getTokenExpiration } from './utils'

export async function createRefreshedSession(
  previousSession: Session
): Promise<Session> {
  const expiration = getTokenExpiration()

  const token = await createToken(previousSession.user.name, expiration)
  const refreshedSession = Session.create({
    token,
    expiration,
    user: previousSession.user,
  })

  await refreshedSession.save()

  previousSession.expiration = Date.now()
  await previousSession.save()

  return refreshedSession
}
