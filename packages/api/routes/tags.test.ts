import { expect, test } from 'vitest'
import { api } from '@piny/tests/api'
import { createSessionMock } from '@piny/session/mocks'
import { createBookmarkMock } from '@piny/bookmark/mocks'
import type { Tag } from '@piny/tag/types'

test('get tags', async () => {
  const session = await createSessionMock()

  const bookmarks = [
    await createBookmarkMock({ user: session.user, privacy: 'public' }),
    await createBookmarkMock({ user: session.user, privacy: 'public' }),
    await createBookmarkMock({ user: session.user, privacy: 'private' }),
    await createBookmarkMock({ user: session.user, privacy: 'private' }),
  ]

  const tags = new Set(
    bookmarks.flatMap((item) => item.tags).map((tag) => tag.name)
  )

  const json = await api
    .get(`/tags`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Tag[]>()

  expect(json).toHaveLength(tags.size)
  expect(json).toContainEqual({
    id: bookmarks[0].tags[0].id,
    name: bookmarks[0].tags[0].name,
  })
})
