import parse from 'co-body'

import {
  NotAcceptable,
  BadRequest,
  Denied,
  Conflict,
  NotFound,
} from '../utils/errors'
import { RouterContext } from '../types/router'
import { Privacy, State } from '../constants/pin'
import { Bookmark } from '../entities/bookmark'
import { Link } from '../entities/link'
import { Session } from '../entities/session'
import { Tag } from '../entities/tag'
import { User } from '../entities/user'

interface UserParams {
  user: string
}

interface BookmarkParams {
  id: string
}

interface SessionState {
  session: Session
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

async function getLink(input: string): Promise<Link> {
  const url = new URL(input)

  const foundLink = await Link.findOne({
    where: { url: url.toString() },
  })

  const link = foundLink ?? Link.create({ url: url.toString() })

  return link.save()
}

async function getTags(input: string[] = [], user: User) {
  const nextTags: Tag[] = []

  for (const name of input) {
    const foundTag = await Tag.findOne({
      where: { name },
      relations: { users: true },
    })

    const tag = foundTag ?? Tag.create({ name })

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
}: RouterContext<UserParams, Partial<SessionState>>) {
  let user: User

  if (params.user) {
    const foundUser = await User.findOne({
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
    throw new Denied()
  }

  const where: {
    user: Pick<User, 'id'>
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

  const bookmarks = await Bookmark.find({
    where,
    relations: { link: true, tags: true },
    order: { createdAt: 'DESC' },
  })

  response.status = 200
  response.body = bookmarks
}

export async function get({
  response,
  params,
}: RouterContext<BookmarkParams, SessionState>) {
  const bookmark = await Bookmark.findOne({
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
}: RouterContext<never, SessionState>) {
  const body = await parse.json(request)

  assertBookmarkPayload(body)

  const link = await getLink(body.url)
  const count = await Bookmark.count({
    where: {
      link: { id: link.id },
      user: { id: state.session.user.id },
      state: State.active,
    },
  })

  if (count > 0) {
    throw new Conflict()
  }

  const bookmark = Bookmark.create({
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
}: RouterContext<BookmarkParams, SessionState>) {
  const bookmark = await Bookmark.findOne({
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
}: RouterContext<BookmarkParams, SessionState>) {
  const bookmark = await Bookmark.findOne({
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
