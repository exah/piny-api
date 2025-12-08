import type { BaseRequest } from 'koa'
import { UserEntity } from '@piny/user/entities'
import {
  ForbiddenError,
  NotFoundError,
  SessionAlreadyRefreshedError,
} from '@piny/status/errors'
import { transaction, manager } from '@piny/db/transaction'
import { assert } from '@piny/tools/assert'
import { Time } from '@piny/tools/constants'
import { SessionEntity } from './entities'
import type { LoginPayload, SessionToken } from './types'
import {
  createToken,
  getPrefixedToken,
  getTokenExpiration,
  validateToken,
  hash,
} from './utils'

export async function getSessionFromToken(token: SessionToken) {
  const session = await SessionEntity.findOne({
    where: { token },
    relations: { user: true, succeedingSession: true },
  })

  if (session === null || session.expiresAt.getTime() <= Date.now()) {
    return null
  }

  return session
}

export async function getSessionFromRequest(request: BaseRequest) {
  const token = await getPrefixedToken(request.get('Authorization'))

  if (token === null || !(await validateToken(token))) {
    return null
  }

  return getSessionFromToken(token)
}

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

  return manager().save(
    SessionEntity.create({
      token,
      user,
      expiresAt: new Date(expiration),
      deviceId: payload.device.id,
      deviceDescription: payload.device.description,
    })
  )
}

export async function createRefreshedSession(
  previousSession: SessionEntity
): Promise<SessionEntity> {
  const expiration = getTokenExpiration()

  if (previousSession.succeedingSession) {
    throw new SessionAlreadyRefreshedError()
  }

  const token = await createToken(previousSession.user.name, expiration.getTime())

  const refreshedSession = SessionEntity.create({
    token,
    expiresAt: new Date(expiration),
    user: previousSession.user,
    deviceId: previousSession.deviceId,
    deviceDescription: previousSession.deviceDescription,
  })

  await transaction(async (manager) => {
    previousSession.succeedingSession = await manager.save(refreshedSession)
    previousSession.expiresAt = new Date(
      Math.min(previousSession.expiresAt.getTime(), Date.now() + Time.MINUTE)
    )

    await manager.save(previousSession)
  })

  return refreshedSession
}

export async function removeSession(token: SessionToken) {
  const session = await manager().findOne(SessionEntity, {
    where: { token },
  })

  assert(session, new NotFoundError())
  session.expiresAt = new Date()

  await manager().save(session)
}
