import { UserEntity } from '@piny/user/entities'
import {
  ForbiddenError,
  NotFoundError,
  SessionAlreadyRefreshedError,
} from '@piny/status/errors'
import { dataSource } from '@piny/db/source'
import { assert } from '@piny/tools/assert'
import { Time } from '@piny/tools/constants'
import { SessionEntity } from './entities'
import { createToken, getTokenExpiration } from './utils'
import type { LoginPayload, SessionToken } from './types'
import { hash } from './utils'

export async function createSession(payload: LoginPayload) {
  const user = await UserEntity.findOne({
    where: { name: payload.user },
    select: ['id', 'pass'],
    relations: { sessions: true },
  })

  assert(user, new NotFoundError())

  if (user.pass !== hash(payload.user, payload.pass)) {
    throw new ForbiddenError()
  }

  const expiration = getTokenExpiration()
  const token = await createToken(user.name, expiration.getTime())

  return SessionEntity.create({
    token,
    user,
    expiresAt: new Date(expiration),
    deviceId: payload.device.id,
    deviceDescription: payload.device.description,
  }).save()
}

export async function createRefreshedSession(
  previousSession: SessionEntity
): Promise<SessionEntity> {
  const expiration = getTokenExpiration()

  if (previousSession.succeedingSession) {
    throw new SessionAlreadyRefreshedError()
  }

  const token = await createToken(
    previousSession.user.name,
    expiration.getTime()
  )

  const refreshedSession = SessionEntity.create({
    token,
    expiresAt: new Date(expiration),
    user: previousSession.user,
    deviceId: previousSession.deviceId,
    deviceDescription: previousSession.deviceDescription,
  })

  previousSession.succeedingSession = refreshedSession
  previousSession.expiresAt = new Date(
    Math.min(previousSession.expiresAt.getTime(), Date.now() + Time.MINUTE)
  )

  await dataSource.transaction(async (manager) => {
    await manager.save(refreshedSession)
    await manager.save(previousSession)
  })

  return refreshedSession
}

export async function removeSession(token: SessionToken) {
  const session = await SessionEntity.findOne({
    where: { token },
  })

  assert(session, new NotFoundError())
  await SessionEntity.softRemove(session)
}
