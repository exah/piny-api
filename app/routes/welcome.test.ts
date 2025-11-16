import { expect, test } from 'vitest'
import { api } from '../../testing/api'

test('welcome', async () => {
  const response = await api.get('/')

  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({ message: `🌲 Welcome to Piny` })
})
