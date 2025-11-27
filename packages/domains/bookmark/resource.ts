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
import type { Bookmark, BookmarkParams, BookmarksListResponse } from './types'
import { State } from './constants'
import { getSessionUser } from '@piny/user/functions'
import { BookmarkEntity } from './entities'
import {
  CreateBookmarkPayloadSchema,
  UpdateBookmarkPayloadSchema,
  BookmarkSchema,
  BookmarksListResponseSchema,
} from './schemas'
import { getUserBookmarks } from './functions'

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
    relations: { link: true, tags: true },
  })

  assert(bookmark, new NotFoundError())
  reply(200, BookmarkSchema, bookmark)
}

export async function add({
  receive,
  reply,
  state,
}: RouterContext<MessageResponse>) {
  assert(state.session)

  const body = await receive(CreateBookmarkPayloadSchema)
  const link = await getLinkForURL(body.url)

  const count = await BookmarkEntity.count({
    where: {
      link: { id: link.id },
      user: { id: state.session.user.id },
      state: State.active,
    },
  })

  if (count > 0) {
    throw new ConflictError()
  }

  const bookmark = BookmarkEntity.create({
    title: body.title,
    description: body.description,
    state: State.active,
    privacy: body.privacy,
    user: state.session.user,
    link,
  })

  if (Array.isArray(body.tags)) {
    bookmark.tags = await getOrCreateTags(body.tags, state.session.user)
  }

  await bookmark.save()

  reply(201, '✨ Created')
}

export async function edit({
  receive,
  reply,
  params,
  state,
}: RouterContext<MessageResponse, BookmarkParams>) {
  assert(state.session, new ForbiddenError())
  assert(params.bookmarkId, new NotFoundError())

  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.bookmarkId, user: { id: state.session.user.id } },
  })

  assert(bookmark, new NotFoundError())

  const body = await receive(UpdateBookmarkPayloadSchema)

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
    bookmark.tags = await getOrCreateTags(body.tags, state.session.user)
  }

  await bookmark.save()

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
