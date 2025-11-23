import { expect, test, describe } from 'vitest'
import { api } from '@piny/tests/api'
import type { BookmarkEntity } from '@piny/bookmark/entities'
import { createSessionMock } from '@piny/session/mocks'
import { createUserMock } from '@piny/user/mocks'
import { createBookmarkMock } from '@piny/bookmark/mocks'

describe('get user', () => {
  test('unauthorized -> error', async () => {
    const user = await createUserMock()

    await expect(() => api.get(`/${user.name}`)).rejects.toThrowError(
      'Request failed with status code 401'
    )
  })

  test('authorized -> self', async () => {
    const session = await createSessionMock()
    const response = await api.get(`/${session.user.name}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      id: expect.any(String),
      type: 'current',
      name: session.user.name,
      email: session.user.email,
    })
  })

  test('authorized -> other user', async () => {
    const session = await createSessionMock()
    const user = await createUserMock()

    const response = await api.get(`/${user.name}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      id: expect.any(String),
      type: 'other',
      name: user.name,
    })
  })
})

describe('get user bookmarks', () => {
  test('unauthorized -> public bookmarks', async () => {
    const user = await createUserMock()

    await createBookmarkMock({ user, privacy: 'private' })
    await createBookmarkMock({ user, privacy: 'private' })

    const publicBookmarks = [
      await createBookmarkMock({ user, privacy: 'public' }),
      await createBookmarkMock({ user, privacy: 'public' }),
      await createBookmarkMock({ user, privacy: 'public' }),
    ]

    const json = await api
      .get(`/${user.name}/bookmarks`)
      .json<BookmarkEntity[]>()

    expect(json).toHaveLength(publicBookmarks.length)
    expect(json).toStrictEqual([
      expect.objectContaining({ id: publicBookmarks[0].id }),
      expect.objectContaining({ id: publicBookmarks[1].id }),
      expect.objectContaining({ id: publicBookmarks[2].id }),
    ])
  })

  test('unauthorized -> public bookmarks -> not found', async () => {
    const user = await createUserMock()

    await createBookmarkMock({ user, privacy: 'private' })
    await createBookmarkMock({ user, privacy: 'private' })

    await expect(() => api.get(`/${user.name}/bookmarks`)).rejects.toThrowError(
      'Request failed with status code 404'
    )
  })

  test('authorized -> all bookmarks', async () => {
    const session = await createSessionMock()
    const bookmarks = [
      await createBookmarkMock({ user: session.user, privacy: 'private' }),
      await createBookmarkMock({ user: session.user, privacy: 'public' }),
      await createBookmarkMock({ user: session.user, privacy: 'private' }),
    ]

    const json = await api
      .get(`/${session.user.name}/bookmarks`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      .json<BookmarkEntity[]>()

    expect(json).toHaveLength(bookmarks.length)
    expect(json).toStrictEqual([
      expect.objectContaining({ id: bookmarks[0].id }),
      expect.objectContaining({ id: bookmarks[1].id }),
      expect.objectContaining({ id: bookmarks[2].id }),
    ])
  })
})
