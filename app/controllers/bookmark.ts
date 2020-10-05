import parse from 'co-body'

import { RouterContext } from '../types'
import { Privacy, State } from '../constants'
import { Bookmark } from '../entities/bookmark'
import { Link } from '../entities/link'
import { Session } from '../entities/session'
import { Tag } from '../entities/tag'
import { User } from '../entities/user'

type UserParams = { user: string }
type BookmarkParams = { id: string }
type SessionState = { session: Session }

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

  throw new Error('input should be an object')
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

  throw new Error(
    'request `body` should contain `url` and valid `privacy` fields'
  )
}

async function getLink(input: string): Promise<Link> {
  const url = new URL(input)

  const foundLink = await Link.findOne({ url: url.toString() })
  const link = foundLink ?? Link.create({ url: url.toString() })

  return link.save()
}

async function getTags(input: string[] = [], user: User) {
  const nextTags: Tag[] = []

  for (const name of input) {
    const foundTag = await Tag.findOne({ name }, { relations: ['users'] })
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

export const BookmarkController = {
  async all({
    response,
    params,
    state,
  }: RouterContext<UserParams, Partial<SessionState>>) {
    try {
      let user: User

      if (params.user) {
        const foundUser = await User.findOne(
          { name: params.user },
          { select: ['id'] }
        )

        if (foundUser === undefined) {
          throw new Error('User not found')
        }

        user = foundUser
      } else if (state.session) {
        user = state.session.user
      } else {
        throw new Error('Please login')
      }

      const where: {
        user: User
        state: State
        privacy?: Privacy
      } = {
        user: user,
        state: State.active,
        privacy: Privacy.public,
      }

      if (state.session?.user.id === user.id) {
        delete where.privacy
      }

      const bookmarks = await Bookmark.find({
        where,
        relations: ['link', 'tags'],
        order: { createdAt: 'DESC' },
      })

      response.status = 200
      response.body = bookmarks
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async get({ response, params }: RouterContext<BookmarkParams, SessionState>) {
    try {
      const bookmark = await Bookmark.findOne(
        { id: params.id },
        { relations: ['link', 'tags'] }
      )

      if (bookmark === undefined) {
        throw new Error('Not found')
      }

      response.status = 200
      response.body = bookmark
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async add({ request, response, state }: RouterContext<never, SessionState>) {
    try {
      const body = await parse.json(request)

      assertBookmarkPayload(body)

      const link = await getLink(body.url)
      const count = await Bookmark.count({
        link,
        user: state.session.user,
        state: State.active,
      })

      if (count > 0) {
        response.status = 409
        response.body = { message: '🙅‍♂️ Already exists' }
        return
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
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async edit({
    request,
    response,
    params,
    state,
  }: RouterContext<BookmarkParams, SessionState>) {
    try {
      const bookmark = await Bookmark.findOne({
        id: params.id,
        user: state.session.user,
      })

      if (!bookmark) {
        response.status = 404
        response.body = { message: '🤷‍♂️ Not found' }
        return
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
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async remove({
    response,
    params,
    state,
  }: RouterContext<BookmarkParams, SessionState>) {
    try {
      const bookmark = await Bookmark.findOne({
        id: params.id,
        user: state.session.user,
      })

      if (!bookmark) {
        response.status = 404
        response.body = { message: '🤷‍♂️ Not found' }
        return
      }

      bookmark.state = State.removed

      await bookmark.save()

      response.status = 200
      response.body = { message: '🗑 Removed' }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
}
