import { RouterContext } from 'https://deno.land/x/oak/mod.ts'
import { JSON_BODY, PrivacyType, State } from '../constants.ts'
import { assertPayload } from '../utils.ts'
import { Bookmark } from '../entities/bookmark.ts'
import { Link } from '../entities/link.ts'
import { Session } from '../entities/session.ts'
import { Tag } from '../entities/tag.ts'
import { User } from '../entities/user.ts'

type UserParams = { user: string }
type BookmarkParams = UserParams & { id: string }
type SessionState = { session: Session }

interface BookmarkPayload {
  url: string
  privacy: PrivacyType
  title?: string | null
  description?: string | null
  tags?: string[]
  state?: State
}

async function getLink(input: string): Promise<Link> {
  const url = new URL(input).toString()
  const link = await Link.findOne({ url })

  return link ?? Link.create({ url }).save()
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
  async get({ response, params }: RouterContext<UserParams>) {
    try {
      const user = await User.findOne(
        { name: params.user },
        {
          select: ['id'],
          relations: ['bookmarks', 'bookmarks.link', 'bookmarks.tags'],
        }
      )

      if (user?.bookmarks?.length) {
        response.body = user.bookmarks.filter(
          (bookmark) => bookmark.state === State.active
        )
      } else {
        response.body = []
      }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
  async add({
    request,
    response,
    params,
    state,
  }: RouterContext<UserParams, SessionState>) {
    try {
      if (params.user !== state.session.user.name) {
        response.status = 403
        response.body = { message: '🙅‍♂️ Forbidden' }
        return
      }

      const body = await request.body(JSON_BODY)

      assertPayload<BookmarkPayload>(
        body,
        (value) =>
          typeof value.url === 'string' && value.privacy in PrivacyType,
        'request `body` should contain `url` and valid `privacy` fields'
      )

      const link = await getLink(body.value.url)
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
        title: body.value.title,
        description: body.value.description,
        state: State.active,
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
      if (params.user !== state.session.user.name) {
        response.status = 403
        response.body = { message: '🙅‍♂️ Forbidden' }
        return
      }

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
        body.value.privacy in PrivacyType
      ) {
        bookmark.privacy = body.value.privacy
      }

      if (typeof body.value.url === 'string') {
        bookmark.link = await getLink(body.value.url)
      }

      if (typeof body.value.state === 'string' && body.value.state in State) {
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
      if (params.user !== state.session.user.name) {
        response.status = 403
        response.body = { message: '🙅‍♂️ Forbidden' }
        return
      }

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
