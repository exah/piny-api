import { expect, test, vi } from 'vitest'
import { Time } from '@piny/tools/constants'
import { api } from '@piny/tests/api'
import { UnauthorizedError } from '@piny/status/errors'
import { createSessionMock } from '@piny/session/mocks'
import type { User } from '@piny/user/types'
import type { TokenResponse } from '@piny/session/types'

test('refresh session', async ({ annotate }) => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date())

  const initialSession = await createSessionMock()
  const requestUser = (token: string) =>
    api
      .get(`/${initialSession.user.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .json<User>()

  await annotate('initial session token is valid')

  const initialUser = await requestUser(initialSession.token)

  expect(initialUser.id).toEqual(initialSession.user.id)
  expect(initialUser.name).toEqual(initialSession.user.name)
  expect(initialUser.type).toBe('current')

  await annotate('session token is updated')
  await vi.runAllTimersAsync()

  const refreshSession = await api
    .post('/refresh-session', {
      headers: { Authorization: `Bearer ${initialSession.token}` },
    })
    .json<TokenResponse>()

  expect(refreshSession.token).not.toEqual(initialSession.token)
  expect(refreshSession).toEqual({
    token: expect.any(String),
    expiresAt: expect.any(String),
  })

  await annotate('initial session token is expired')
  await vi.advanceTimersByTimeAsync(Time.MINUTE)

  await expect(() => requestUser(initialSession.token)).rejects.toThrowError(
    UnauthorizedError
  )

  await annotate('updated session token returns the same user')

  const user = await requestUser(refreshSession.token)
  expect(user).toEqual(initialUser)

  vi.useRealTimers()
})

test('logout', async ({ annotate }) => {
  const session = await createSessionMock()
  const requestUser = (token: string) =>
    api
      .get(`/${session.user.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .json<User>()

  await annotate('session token is valid before logout')

  const user = await requestUser(session.token)
  expect(user.id).toEqual(session.user.id)
  expect(user.name).toEqual(session.user.name)
  expect(user.type).toBe('current')

  await annotate('logout invalidates the session')

  await api.post('/logout', {
    headers: { Authorization: `Bearer ${session.token}` },
  })

  await annotate('session token is invalid after logout')

  await expect(() => requestUser(session.token)).rejects.toThrowError(
    UnauthorizedError
  )
})
