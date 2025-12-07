import { expect, test } from 'vitest'
import { api } from '@piny/tests/api'
import { UnauthorizedError, NotFoundError, ConflictError } from '@piny/status/errors'
import { createSessionMock } from '@piny/session/mocks'
import { createBookmarkMock } from '@piny/bookmark/mocks'
import { createLinkMock } from '@piny/link/mocks'
import type { Bookmark, CreateBookmarkResponse } from '@piny/bookmark/types'
import type { MessageResponse } from '@piny/status/types'

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
    tags: expect.arrayContaining(
      bookmarks[0].bookmarkTags.map(({ tag }) => ({
        id: tag.id,
        name: tag.name,
      }))
    ),
    createdAt: bookmarks[0].createdAt.toJSON(),
    updatedAt: bookmarks[0].updatedAt.toJSON(),
  })
})

test('get bookmarks list with stable tag order', async () => {
  const session = await createSessionMock()

  const createBookmark = async (tags: string[]) => {
    const link = await createLinkMock()
    await api.post(`/bookmarks`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: { url: link.url, privacy: 'private', tags },
    })
  }

  await createBookmark(['baz', 'bar', 'foo'])
  await createBookmark(['foo', 'bar', 'baz'])

  const result = await api
    .get(`/bookmarks`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Bookmark[]>()

  expect(result[0].tags[0]).toMatchObject({ name: 'baz' })
  expect(result[0].tags[1]).toMatchObject({ name: 'bar' })
  expect(result[0].tags[2]).toMatchObject({ name: 'foo' })
  expect(result[1].tags[0]).toMatchObject({ name: 'foo' })
  expect(result[1].tags[1]).toMatchObject({ name: 'bar' })
  expect(result[1].tags[2]).toMatchObject({ name: 'baz' })
})

test('get bookmarks unauthorized', async () => {
  await createBookmarkMock({ privacy: 'public' })
  await createBookmarkMock({ privacy: 'private' })

  await expect(() => api.get(`/bookmarks`)).rejects.toThrowError(UnauthorizedError)
})

test('get single bookmark', async () => {
  const session = await createSessionMock()
  const bookmark = await createBookmarkMock({
    user: session.user,
    privacy: 'public',
  })

  const json = await api
    .get(`/bookmarks/${bookmark.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Bookmark>()

  expect(json).toStrictEqual({
    id: bookmark.id,
    link: { id: bookmark.link.id, url: bookmark.link.url },
    title: bookmark.title,
    description: bookmark.description,
    state: bookmark.state,
    privacy: bookmark.privacy,
    tags: expect.arrayContaining(
      bookmark.bookmarkTags.map(({ tag }) => ({
        id: tag.id,
        name: tag.name,
      }))
    ),
    createdAt: bookmark.createdAt.toJSON(),
    updatedAt: bookmark.updatedAt.toJSON(),
  })
})

test('get single bookmark with stable tag order', async () => {
  const session = await createSessionMock()
  const link = await createLinkMock()

  const bookmark = await api
    .post(`/bookmarks`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: {
        url: link.url,
        privacy: 'private',
        tags: ['zebra', 'apple', 'banana'],
      },
    })
    .json<CreateBookmarkResponse>()

  const json = await api
    .get(`/bookmarks/${bookmark.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Bookmark>()

  expect(json.tags).toHaveLength(3)
  expect(json.tags[0]).toMatchObject({ name: 'zebra' })
  expect(json.tags[1]).toMatchObject({ name: 'apple' })
  expect(json.tags[2]).toMatchObject({ name: 'banana' })
})

test('get single bookmark not found', async () => {
  const session = await createSessionMock()

  await expect(() =>
    api.get(`/bookmarks/00000000-0000-0000-0000-000000000000`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
  ).rejects.toThrowError(NotFoundError)
})

test('get single bookmark unauthorized', async () => {
  const bookmark = await createBookmarkMock({ privacy: 'public' })

  await expect(() => api.get(`/bookmarks/${bookmark.id}`)).rejects.toThrowError(
    UnauthorizedError
  )
})

test('add bookmark', async () => {
  const session = await createSessionMock()
  const link = await createLinkMock('https://example.com')

  const json = await api
    .post(`/bookmarks`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: {
        url: link.url,
        title: 'Test Bookmark',
        description: 'Test Description',
        privacy: 'public',
        tags: ['tag1', 'tag2'],
      },
    })
    .json<MessageResponse>()

  expect(json).toStrictEqual({
    id: expect.any(String),
    message: '✨ Created',
  })
})

test('add bookmark unauthorized', async () => {
  await expect(() =>
    api.post(`/bookmarks`, {
      json: {
        url: 'https://example.com',
        title: 'Test',
        description: 'Test',
        privacy: 'public',
      },
    })
  ).rejects.toThrowError(UnauthorizedError)
})

test('add bookmark conflict', async () => {
  const session = await createSessionMock()

  const bookmark = await createBookmarkMock({
    user: session.user,
  })

  await expect(() =>
    api.post(`/bookmarks`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: {
        url: bookmark.link.url,
        title: 'Duplicate',
        description: 'Duplicate',
        privacy: 'public',
      },
    })
  ).rejects.toThrowError(ConflictError)
})

test('edit bookmark', async () => {
  const session = await createSessionMock()
  const bookmark = await createBookmarkMock({
    user: session.user,
    privacy: 'public',
  })

  const json = await api
    .patch(`/bookmarks/${bookmark.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: {
        title: 'Updated Title',
        description: 'Updated Description',
        privacy: 'private',
      },
    })
    .json<MessageResponse>()

  expect(json).toStrictEqual({ message: '💾 Saved' })
})

test('edit bookmark tags', async () => {
  const session = await createSessionMock()
  const bookmarkMock = await createBookmarkMock({
    user: session.user,
    privacy: 'public',
    tagsList: ['zebra', 'apple', 'banana'],
  })

  expect(
    await api
      .patch(`/bookmarks/${bookmarkMock.id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
        json: { tags: ['foo', 'bar', 'baz'] },
      })
      .json<MessageResponse>()
  ).toStrictEqual({ message: '💾 Saved' })

  const bookmarkResponse = await api
    .get(`/bookmarks/${bookmarkMock.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Bookmark>()

  expect(bookmarkResponse.tags).toHaveLength(3)
  expect(bookmarkResponse.tags[0]).toMatchObject({ name: 'foo' })
  expect(bookmarkResponse.tags[1]).toMatchObject({ name: 'bar' })
  expect(bookmarkResponse.tags[2]).toMatchObject({ name: 'baz' })
})

test('parallel edit bookmark tags', async () => {
  const session = await createSessionMock()
  const bookmarkMock = await createBookmarkMock({
    user: session.user,
    privacy: 'public',
    tagsList: ['zebra', 'apple', 'banana'],
  })

  const updateTag = (tags: string[]) =>
    api.patch(`/bookmarks/${bookmarkMock.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: { tags },
    })

  await Promise.all([updateTag(['bar', 'baz', 'foo']), updateTag(['foo', 'bar', 'baz'])])

  const bookmarkResponse = await api
    .get(`/bookmarks/${bookmarkMock.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Bookmark>()

  expect(bookmarkResponse.tags).toHaveLength(3)
  expect(bookmarkResponse.tags[0]).toMatchObject({ name: 'foo' })
  expect(bookmarkResponse.tags[1]).toMatchObject({ name: 'bar' })
  expect(bookmarkResponse.tags[2]).toMatchObject({ name: 'baz' })
})

test('edit bookmark unauthorized', async () => {
  const bookmark = await createBookmarkMock({ privacy: 'public' })

  await expect(() =>
    api.patch(`/bookmarks/${bookmark.id}`, {
      json: { title: 'Updated' },
    })
  ).rejects.toThrowError(UnauthorizedError)
})

test('edit bookmark not found', async () => {
  const session = await createSessionMock()
  const id = crypto.randomUUID()

  await expect(() =>
    api.patch(`/bookmarks/${id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: { title: 'Updated' },
    })
  ).rejects.toThrowError(NotFoundError)
})

test('edit another user bookmark', async () => {
  const session = await createSessionMock()
  const bookmark = await createBookmarkMock({ privacy: 'public' })

  await expect(() =>
    api.patch(`/bookmarks/${bookmark.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
      json: { title: 'Updated' },
    })
  ).rejects.toThrowError(NotFoundError)
})

test('remove bookmark', async () => {
  const session = await createSessionMock()
  const bookmark = await createBookmarkMock({
    user: session.user,
    privacy: 'public',
  })

  const json = await api
    .delete(`/bookmarks/${bookmark.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<MessageResponse>()

  expect(json).toStrictEqual({ message: '🗑 Removed' })
})

test('remove bookmark unauthorized', async () => {
  const bookmark = await createBookmarkMock({ privacy: 'public' })

  await expect(() => api.delete(`/bookmarks/${bookmark.id}`)).rejects.toThrowError(
    UnauthorizedError
  )
})

test('remove bookmark not found', async () => {
  const session = await createSessionMock()
  const id = crypto.randomUUID()

  await expect(() =>
    api.delete(`/bookmarks/${id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
  ).rejects.toThrowError(NotFoundError)
})

test('remove another user bookmark', async () => {
  const session = await createSessionMock()
  const bookmark = await createBookmarkMock({ privacy: 'public' })

  await expect(() =>
    api.delete(`/bookmarks/${bookmark.id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
  ).rejects.toThrowError(NotFoundError)
})
