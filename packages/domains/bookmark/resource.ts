import { assert } from '@piny/tools/assert'
import type { MessageResponse } from '@piny/status/types'
import {
  ForbiddenError,
  ConflictError,
  NotFoundError,
} from '@piny/status/errors'
import type { RouterContext } from '@piny/api/types/router'
import type { UserParams } from '@piny/user/types'
import { getLinkForURL } from '@piny/link/functions'
import { getOrCreateTags } from '@piny/tag/functions'
import type {
  Bookmark,
  BookmarkParams,
  CreateBookmarkResponse,
  BookmarksListResponse,
} from './types'
import { State } from './constants'
import { getSessionUser } from '@piny/user/functions'
import { BookmarkEntity, BookmarkTagEntity } from './entities'
import {
  BookmarkSchema,
  CreateBookmarkPayloadSchema,
  CreateBookmarkResponseSchema,
  UpdateBookmarkPayloadSchema,
  BookmarksListResponseSchema,
} from './schemas'
import { getUserBookmarks } from './functions'
import { dataSource } from '@piny/db/source'

export async function all({
  params,
  state,
  reply,
}: RouterContext<BookmarksListResponse, UserParams>) {
  const [user, userType] = await getSessionUser(state.session, params.user)
  const bookmarks = await getUserBookmarks(user, userType)

  reply(200, BookmarksListResponseSchema, bookmarks)
}

export async function get({
  params,
  reply,
}: RouterContext<Bookmark, BookmarkParams>) {
  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.bookmarkId },
    relations: { link: true, bookmarkTags: { tag: true } },
    order: { bookmarkTags: { order: 'ASC' } },
  })

  assert(bookmark, new NotFoundError())

  reply(200, BookmarkSchema, {
    ...bookmark,
    tags: bookmark.bookmarkTags.map(({ tag }) => tag),
  })
}

export async function add({
  receive,
  reply,
  state,
}: RouterContext<CreateBookmarkResponse>) {
  assert(state.session, new ForbiddenError())

  const user = state.session.user
  const body = await receive(CreateBookmarkPayloadSchema)
  const link = await getLinkForURL(body.url)

  const result = await dataSource.transaction(async (manager) => {
    const existing = await manager.findOne(BookmarkEntity, {
      where: {
        link: { id: link.id },
        user: { id: user.id },
        state: State.active,
      },
    })

    if (existing) {
      throw new ConflictError()
    }

    const bookmark = BookmarkEntity.create({
      title: body.title,
      description: body.description,
      state: State.active,
      privacy: body.privacy,
      user,
      link,
    })

    await manager.save(bookmark)

    if (Array.isArray(body.tags)) {
      const tags = await getOrCreateTags(body.tags, user)
      const bookmarkTags = tags.map((tag, index) =>
        BookmarkTagEntity.create({ bookmark, tag, order: index })
      )
      await manager.save(bookmarkTags)
    }

    return bookmark
  })

  reply(201, CreateBookmarkResponseSchema, {
    id: result.id,
    message: '✨ Created',
  })
}

export async function edit({
  receive,
  reply,
  params,
  state,
}: RouterContext<MessageResponse, BookmarkParams>) {
  assert(state.session, new ForbiddenError())
  assert(params.bookmarkId, new NotFoundError())

  const user = state.session.user
  const body = await receive(UpdateBookmarkPayloadSchema)

  await dataSource.transaction(async (manager) => {
    const bookmark = await BookmarkEntity.findOne({
      where: { id: params.bookmarkId, user: { id: user.id } },
      relations: { bookmarkTags: true },
    })

    assert(bookmark, new NotFoundError())

    if (body.title !== undefined) {
      bookmark.title = body.title
    }

    if (body.description !== undefined) {
      bookmark.description = body.description
    }

    if (body.privacy !== undefined) {
      bookmark.privacy = body.privacy
    }

    if (body.url !== undefined) {
      bookmark.link = await getLinkForURL(body.url)
    }

    if (body.state !== undefined) {
      bookmark.state = body.state
    }

    if (body.tags !== undefined) {
      await manager.remove(bookmark.bookmarkTags)
      const tags = await getOrCreateTags(body.tags, user)

      bookmark.bookmarkTags = await manager.save(
        tags.map((tag, index) =>
          BookmarkTagEntity.create({ bookmark, tag, order: index })
        )
      )
    }

    await manager.save(bookmark)
  })

  reply(200, '💾 Saved')
}

export async function remove({
  params,
  reply,
  state,
}: RouterContext<MessageResponse, BookmarkParams>) {
  assert(state.session, new ForbiddenError())
  assert(params.bookmarkId, new NotFoundError())

  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.bookmarkId, user: { id: state.session.user.id } },
  })

  assert(bookmark, new NotFoundError())

  bookmark.state = State.removed
  await bookmark.save()

  reply(200, '🗑 Removed')
}
