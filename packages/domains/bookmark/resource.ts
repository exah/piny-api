import { assert } from '@piny/tools/assert'
import { UserEntity } from '@piny/user/entities'
import type { MessageResponse } from '@piny/status/types'
import { Forbidden, Conflict, NotFound } from '@piny/status/errors'
import type { RouterContext } from '@piny/api/types/router'
import type { UserParams } from '@piny/user/types'
import { getLinkForURL } from '@piny/link/functions'
import { getOrCreateTags } from '@piny/tag/functions'
import type { Bookmark, BookmarkParams, BookmarksListResponse } from './types'
import { Privacy, State } from './constants'
import { BookmarkEntity } from './entities'
import {
  CreateBookmarkPayloadSchema,
  UpdateBookmarkPayloadSchema,
  BookmarkSchema,
  BookmarksListResponseSchema,
} from './schemas'

export async function all({
  params,
  state,
  reply,
}: RouterContext<BookmarksListResponse, UserParams>) {
  let user: UserEntity

  if (params.user) {
    const foundUser = await UserEntity.findOne({
      where: { name: params.user },
      select: ['id'],
    })

    if (foundUser == null) {
      throw new NotFound()
    }

    user = foundUser
  } else if (state.session) {
    user = state.session.user
  } else {
    throw new Forbidden()
  }

  const where: {
    user: Pick<UserEntity, 'id'>
    state: State
    privacy?: Privacy
  } = {
    user: { id: user.id },
    state: State.active,
    privacy: Privacy.public,
  }

  if (state.session?.user.id === user.id) {
    delete where.privacy
  }

  const bookmarks = await BookmarkEntity.find({
    where,
    relations: { link: true, tags: true },
    order: { createdAt: 'DESC' },
  })

  if (bookmarks.length === 0 && where.privacy === Privacy.public) {
    throw new NotFound()
  }

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

  if (bookmark === null) {
    throw new NotFound()
  }

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
    throw new Conflict()
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
  assert(params.bookmarkId)
  assert(state.session)

  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.bookmarkId, user: { id: state.session.user.id } },
  })

  if (!bookmark) {
    throw new NotFound()
  }

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
  assert(params.bookmarkId)
  assert(state.session)

  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.bookmarkId, user: { id: state.session.user.id } },
  })

  if (!bookmark) {
    throw new NotFound()
  }

  bookmark.state = State.removed
  await bookmark.save()

  reply(200, '🗑 Removed')
}
