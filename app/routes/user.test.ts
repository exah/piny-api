import { expect, test } from 'vitest'
import { api } from '../../testing/api'
import { createSessionMock } from '../mocks/auth'
import { createUserMock } from '../mocks/user'

test('get unauthorized user', async () => {
  const user = await createUserMock()

  await expect(() => api.get(`/${user.name}`)).rejects.toThrowError(
    'Request failed with status code 401'
  )
})

test('get authorized user', async () => {
  const session = await createSessionMock()
  const response = await api.get(`/${session.user.name}`, {
    headers: { Authorization: `Bearer ${session.token}` },
  })

  expect(response.status).toBe(200)
  expect(await response.json()).toStrictEqual({
    id: expect.any(String),
    name: session.user.name,
    email: session.user.email,
  })
})

test('get other user with authorized request', async () => {
  const session = await createSessionMock()
  const user = await createUserMock()

  const response = await api.get(`/${user.name}`, {
    headers: { Authorization: `Bearer ${session.token}` },
  })

  expect(response.status).toBe(200)
  expect(await response.json()).toStrictEqual({
    id: expect.any(String),
    name: user.name,
  })
})
