import { expect, test, describe } from 'vitest'
import { api } from '@piny/tests/api'
import type { Bookmark } from '@piny/bookmark/types'
import type { Tag } from '@piny/tag/types'
import { Unauthorized, NotFound } from '@piny/status/errors'
import { createSessionMock } from '@piny/session/mocks'
import { createUserMock } from '@piny/user/mocks'
import { createBookmarkMock } from '@piny/bookmark/mocks'

describe('get user', () => {
  test('unauthorized -> error', async () => {
    const user = await createUserMock()

    await expect(() => api.get(`/${user.name}`)).rejects.toThrowError(
      Unauthorized
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

    const json = await api.get(`/${user.name}/bookmarks`).json<Bookmark[]>()

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
      NotFound
    )
  })

  test('unauthorized -> public tags', async () => {
    const user = await createUserMock()

    await createBookmarkMock({ user, privacy: 'private' })
    const publicBookmarks = [
      await createBookmarkMock({ user, privacy: 'public' }),
    ]

    const tags = new Set(
      publicBookmarks.flatMap((item) => item.tags).map((tag) => tag.name)
    )

    const json = await api.get(`/${user.name}/tags`).json<Tag[]>()

    expect(json).toHaveLength(tags.size)
    expect(json).toContainEqual({
      id: publicBookmarks[0].tags[0].id,
      name: publicBookmarks[0].tags[0].name,
    })
  })

  test('unauthorized -> public tags -> not found', async () => {
    const user = await createUserMock()

    await createBookmarkMock({ user, privacy: 'private' })
    await expect(() => api.get(`/${user.name}/tags`)).rejects.toThrowError(
      NotFound
    )
  })

  test('authorized -> all bookmarks', async () => {
    const session = await createSessionMock()
    const bookmarks = [
      await createBookmarkMock({ user: session.user, privacy: 'private' }),
      await createBookmarkMock({ user: session.user, privacy: 'public' }),
    ]

    const json = await api
      .get(`/${session.user.name}/bookmarks`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      .json<Bookmark[]>()

    expect(json).toHaveLength(bookmarks.length)
    expect(json).toStrictEqual([
      expect.objectContaining({ id: bookmarks[0].id }),
      expect.objectContaining({ id: bookmarks[1].id }),
    ])
  })

  test('authorized -> all tags', async () => {
    const session = await createSessionMock()

    const bookmarks = [
      await createBookmarkMock({ user: session.user, privacy: 'private' }),
      await createBookmarkMock({ user: session.user, privacy: 'public' }),
    ]

    const tags = new Set(
      bookmarks.flatMap((item) => item.tags).map((tag) => tag.name)
    )

    const json = await api
      .get(`/${session.user.name}/tags`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      .json<Tag[]>()

    expect(json).toHaveLength(tags.size)
    expect(json).toContainEqual({
      id: bookmarks[0].tags[0].id,
      name: bookmarks[0].tags[0].name,
    })
  })
})
