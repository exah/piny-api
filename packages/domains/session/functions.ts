import { UserEntity } from '@piny/user/entities'
import { Forbidden, NotFound } from '@piny/status/errors'
import { assert } from '@piny/tools/assert'
import { SessionEntity } from './entities'
import { createToken, getTokenExpiration } from './utils'
import type { LoginPayload, SignupPayload, SessionToken } from './types'
import { hash } from './utils'

export async function createUser(payload: SignupPayload) {
  const nameCount = await UserEntity.count({
    where: { name: payload.user },
  })

  if (nameCount > 0) {
    throw new Forbidden('👯‍♀️ Use different `user`')
  }

  const emailCount = await UserEntity.count({
    where: { email: payload.email },
  })

  if (emailCount > 0) {
    throw new Forbidden('💌 Use different `email`')
  }

  const user = UserEntity.create({
    name: payload.user,
    email: payload.email,
    pass: hash(payload.user, payload.pass),
  })

  await user.save()
}

export async function createSession(payload: LoginPayload) {
  const user = await UserEntity.findOne({
    where: { name: payload.user },
    select: ['id', 'pass'],
    relations: { sessions: true },
  })

  assert(user, new NotFound())

  if (user.pass !== hash(payload.user, payload.pass)) {
    throw new Forbidden()
  }

  const expiration = getTokenExpiration()
  const token = await createToken(user.name, expiration)

  return SessionEntity.create({ token, expiration, user }).save()
}

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

export async function removeSession(token: SessionToken) {
  const session = await SessionEntity.findOne({
    where: { token },
  })

  assert(session, new NotFound())
  await SessionEntity.remove(session)
}
