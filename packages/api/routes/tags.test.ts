import { expect, test } from 'vitest'
import { api } from '@piny/tests/api'
import { createSessionMock } from '@piny/session/mocks'
import { createBookmarkMock } from '@piny/bookmark/mocks'

test('get tags', async () => {
  const session = await createSessionMock()

  const bookmarks = [
    await createBookmarkMock({ user: session.user, privacy: 'public' }),
    await createBookmarkMock({ user: session.user, privacy: 'public' }),
    await createBookmarkMock({ user: session.user, privacy: 'private' }),
    await createBookmarkMock({ user: session.user, privacy: 'private' }),
  ]

  const tags = bookmarks.flatMap((item) => item.tags)

  const response = await api.get(`/tags`, {
    headers: { Authorization: `Bearer ${session.token}` },
  })

  expect(response.status).toBe(200)
  expect(await response.json()).toHaveLength(tags.length)
})
