import { expect, test } from 'vitest'
import { api } from '@piny/tests/api'
import type { User } from '@piny/user/entities'
import { createSessionMock } from '@piny/session/mocks'

test('refresh session', async ({ annotate }) => {
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
  expect(initialUser.email).toEqual(initialSession.user.email)

  await annotate('session token is updated')

  const refreshSession = await api
    .post('/refresh-session', {
      headers: { Authorization: `Bearer ${initialSession.token}` },
    })
    .json<{ token: string }>()

  expect(refreshSession.token).toEqual(expect.any(String))
  expect(refreshSession.token).not.toEqual(initialSession.token)

  await annotate('initial session token is expired')

  await expect(() => requestUser(initialSession.token)).rejects.toThrowError(
    'Request failed with status code 401'
  )

  await annotate('updated session token returns the same user')

  const user = await requestUser(refreshSession.token)
  expect(user).toEqual(initialUser)
})
