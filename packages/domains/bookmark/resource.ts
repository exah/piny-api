import parse from 'co-body'
import { assert } from '@piny/tools/assert'
import { LinkEntity } from '@piny/link/entities'
import { TagEntity } from '@piny/tag/entities'
import { UserEntity } from '@piny/user/entities'
import {
  NotAcceptable,
  BadRequest,
  Forbidden,
  Conflict,
  NotFound,
} from '@piny/error'
import type { RouterContext } from '@piny/api/types/router'
import { Privacy, State } from './constants'
import { BookmarkEntity } from './entities'

type UserParams = {
  user: string
}

type BookmarkParams = {
  id: string
}

interface BookmarkPayload {
  url: string
  privacy: Privacy
  title?: string | null
  description?: string | null
  tags?: string[]
  state?: State
}

function assertPartialBookmarkPayload(
  input: unknown
): asserts input is Partial<BookmarkPayload> {
  if (input !== null && typeof input === 'object') return

  throw new NotAcceptable()
}

function assertBookmarkPayload(
  input: unknown
): asserts input is BookmarkPayload {
  assertPartialBookmarkPayload(input)

  if (
    typeof input.url === 'string' &&
    typeof input.privacy === 'string' &&
    input.privacy in Privacy
  ) {
    return
  }

  throw new BadRequest(
    `🤦‍♂️ request body should contain 'url' and valid 'privacy' fields`
  )
}

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
}: RouterContext<never, UserParams>) {
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
  response.body = bookmarks
}

export async function get({
  response,
  params,
}: RouterContext<never, BookmarkParams>) {
  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.id },
    relations: { link: true, tags: true },
  })

  if (bookmark === undefined) {
    throw new NotFound()
  }

  response.status = 200
  response.body = bookmark
}

export async function add({
  request,
  response,
  state,
}: RouterContext<never, never>) {
  const body = await parse.json(request)

  assert(state.session)
  assertBookmarkPayload(body)

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
}: RouterContext<never, BookmarkParams>) {
  assert(state.session)

  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.id, user: { id: state.session.user.id } },
  })

  if (!bookmark) {
    throw new NotFound()
  }

  const body = await parse.json(request)

  assertPartialBookmarkPayload(body)

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
}: RouterContext<never, BookmarkParams>) {
  assert(state.session)

  const bookmark = await BookmarkEntity.findOne({
    where: { id: params.id, user: { id: state.session.user.id } },
  })

  if (!bookmark) {
    throw new NotFound()
  }

  bookmark.state = State.removed

  await bookmark.save()

  response.status = 200
  response.body = { message: '🗑 Removed' }
}
