import { RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts'
import { JSON_BODY, BookmarkPrivacy, BookmarkState } from '../constants.ts'
import { assertPayload } from '../utils.ts'
import { Bookmark } from '../entities/bookmark.ts'
import { Link } from '../entities/link.ts'
import { Session } from '../entities/session.ts'
import { Tag } from '../entities/tag.ts'
import { User } from '../entities/user.ts'

type UserParams = { user: string }
type BookmarkParams = { id: string }
type SessionState = { session: Session }

interface BookmarkPayload {
  url: string
  privacy: BookmarkPrivacy
  title?: string | null
  description?: string | null
  tags?: string[]
  state?: BookmarkState
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
  async get({
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

      const where = {
        userId: user.id,
        state: BookmarkState.active,
        privacy: BookmarkPrivacy.public,
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
  async add({ request, response, state }: RouterContext<never, SessionState>) {
    try {
      const body = await request.body(JSON_BODY)

      assertPayload<BookmarkPayload>(
        body,
        (value) =>
          typeof value.url === 'string' && value.privacy in BookmarkPrivacy,
        'request `body` should contain `url` and valid `privacy` fields'
      )

      const link = await getLink(body.value.url)
      const count = await Bookmark.count({
        link,
        user: state.session.user,
        state: BookmarkState.active,
      })

      if (count > 0) {
        response.status = 409
        response.body = { message: '🙅‍♂️ Already exists' }
        return
      }

      const bookmark = Bookmark.create({
        title: body.value.title,
        description: body.value.description,
        state: BookmarkState.active,
        privacy: body.value.privacy,
        user: state.session.user,
        link,
      })

      if (Array.isArray(body.value.tags)) {
        bookmark.tags = await getTags(body.value.tags, state.session.user)
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

      const body = await request.body(JSON_BODY)

      assertPayload<Partial<BookmarkPayload>>(body)

      if (body.value.title !== undefined) {
        bookmark.title = body.value.title
      }

      if (body.value.description !== undefined) {
        bookmark.description = body.value.description
      }

      if (
        typeof body.value.privacy === 'string' &&
        body.value.privacy in BookmarkPrivacy
      ) {
        bookmark.privacy = body.value.privacy
      }

      if (typeof body.value.url === 'string') {
        bookmark.link = await getLink(body.value.url)
      }

      if (
        typeof body.value.state === 'string' &&
        body.value.state in BookmarkState
      ) {
        bookmark.state = body.value.state
      }

      if (Array.isArray(body.value.tags)) {
        bookmark.tags = await getTags(body.value.tags, state.session.user)
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

      bookmark.state = BookmarkState.removed

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
