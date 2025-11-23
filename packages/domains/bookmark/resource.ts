import parse from 'co-body'
import { assert } from '@piny/tools/assert'
import { LinkEntity } from '@piny/link/entities'
import { TagEntity } from '@piny/tag/entities'
import { UserEntity } from '@piny/user/entities'
import type { MessageResponse } from '@piny/status/types'
import { Forbidden, Conflict, NotFound } from '@piny/status/errors'
import type { RouterContext } from '@piny/api/types/router'
import type { UserParams } from '@piny/user/types'
import type { Bookmark, BookmarkParams, BookmarksListResponse } from './types'
import { Privacy, State } from './constants'
import { BookmarkEntity } from './entities'
import { createSchemaParser } from '@piny/tools/parse-schema'
import {
  CreateBookmarkPayloadSchema,
  UpdateBookmarkPayloadSchema,
  BookmarkSchema,
  BookmarksListResponseSchema,
} from './schemas'

const parseBookmark = createSchemaParser(BookmarkSchema)

const parseBookmarksListResponse = createSchemaParser(
  BookmarksListResponseSchema
)

const parseCreateBookmarkPayload = createSchemaParser(
  CreateBookmarkPayloadSchema
)

const parseUpdateBookmarkPayload = createSchemaParser(
  UpdateBookmarkPayloadSchema
)

async function getLink(input: string): Promise<LinkEntity> {
  const url = new URL(input)

  const foundLink = await LinkEntity.findOne({
    where: { url: url.toString() },
  })

  const link = foundLink ?? LinkEntity.create({ url: url.toString() })

  return link.save()
}

async function getTags(input: string[] = [], user: UserEntity) {
  const nextTags: TagEntity[] = []

  for (const name of input) {
    const foundTag = await TagEntity.findOne({
      where: { name },
      relations: { users: true },
    })

    const tag = foundTag ?? TagEntity.create({ name })

    if (tag.users) {
      tag.users.push(user)
    } else {
      tag.users = [user]
    }

    nextTags.push(await tag.save())
  }

  return nextTags
}

export async function all({
  response,
  params,
  state,
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

  response.status = 200
  response.body = await parseBookmarksListResponse(bookmarks)
}

export async function get({
  response,
  params,
}: RouterContext<Bookmark, BookmarkParams>) {
  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.bookmarkId },
    relations: { link: true, tags: true },
  })

  if (bookmark === null) {
    throw new NotFound()
  }

  response.status = 200
  response.body = await parseBookmark(bookmark)
}

export async function add({
  request,
  response,
  state,
}: RouterContext<MessageResponse>) {
  assert(state.session)

  const body = await parseCreateBookmarkPayload(await parse.json(request))
  const link = await getLink(body.url)

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
    bookmark.tags = await getTags(body.tags, state.session.user)
  }

  await bookmark.save()

  response.status = 201
  response.body = { message: '✨ Created' }
}

export async function edit({
  request,
  response,
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

  const body = await parseUpdateBookmarkPayload(await parse.json(request))

  if (body.title !== undefined) {
    bookmark.title = body.title
  }

  if (body.description !== undefined) {
    bookmark.description = body.description
  }

  if (typeof body.privacy === 'string' && body.privacy in Privacy) {
    bookmark.privacy = body.privacy
  }

  if (typeof body.url === 'string') {
    bookmark.link = await getLink(body.url)
  }

  if (typeof body.state === 'string' && body.state in State) {
    bookmark.state = body.state
  }

  if (Array.isArray(body.tags)) {
    bookmark.tags = await getTags(body.tags, state.session.user)
  }

  await bookmark.save()

  response.status = 200
  response.body = { message: '💾 Saved' }
}

export async function remove({
  response,
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

  bookmark.state = State.removed

  await bookmark.save()

  response.status = 200
  response.body = { message: '🗑 Removed' }
}
