import { expect, test } from 'vitest'
import { api } from '@piny/tests/api'
import { UnauthorizedError } from '@piny/status/errors'
import { createSessionMock } from '@piny/session/mocks'
import { createBookmarkMock } from '@piny/bookmark/mocks'
import type { Bookmark } from '@piny/bookmark/types'

test('get bookmarks', async () => {
  const session = await createSessionMock()

  const bookmarks = [
    await createBookmarkMock({ user: session.user, privacy: 'public' }),
    await createBookmarkMock({ user: session.user, privacy: 'private' }),
  ]

  const json = await api
    .get(`/bookmarks`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Bookmark[]>()

  expect(json).toHaveLength(2)
  expect(json[0]).toStrictEqual({
    id: bookmarks[0].id,
    link: { id: bookmarks[0].link.id, url: bookmarks[0].link.url },
    title: bookmarks[0].title,
    description: bookmarks[0].description,
    state: bookmarks[0].state,
    privacy: bookmarks[0].privacy,
    tags: bookmarks[0].tags.map((tag) => ({ id: tag.id, name: tag.name })),
    createdAt: bookmarks[0].createdAt.toJSON(),
    updatedAt: bookmarks[0].updatedAt.toJSON(),
  })
})

test('unauthorized', async () => {
  await createBookmarkMock({ privacy: 'public' })
  await createBookmarkMock({ privacy: 'private' })

  expect(() => api.get(`/bookmarks`).json<Bookmark[]>()).rejects.toThrowError(
    UnauthorizedError
  )
})
