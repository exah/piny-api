import { expect, test } from 'vitest'
import { api } from '@piny/tests/api'
import { createSessionMock } from '@piny/session/mocks'
import { createBookmarkMock } from '@piny/bookmark/mocks'
import { createTagsListMock } from '@piny/tag/mocks'
import type { Tag } from '@piny/tag/types'

test('get current user tags', async ({ annotate }) => {
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
  await annotate('unique tags with bookmarks')

  const json1 = await api
    .get(`/tags`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Tag[]>()

  expect(json1).toHaveLength(tags.size)
  expect(json1).toContainEqual({
    id: bookmarks[0].tags[0].id,
    name: bookmarks[0].tags[0].name,
  })

  await annotate('not to contain orphan tags (no bookmarks links)')
  const orphans = await createTagsListMock(undefined, session.user)

  const json2 = await api
    .get(`/tags`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    .json<Tag[]>()

  expect(json2).toHaveLength(tags.size)
  expect(json2).toEqual(json1)
  expect(json2).not.toContainEqual({
    id: orphans[0].id,
    name: orphans[0].name,
  })
})
