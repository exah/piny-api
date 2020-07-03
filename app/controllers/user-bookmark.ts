import { RouterContext, Body } from 'https://deno.land/x/oak/mod.ts'
import { JSON_BODY, PrivacyType } from '../constants.ts'
import { Bookmark } from '../entities/bookmark.ts'
import { Link } from '../entities/link.ts'
import { Session } from '../entities/session.ts'
import { Tag } from '../entities/tag.ts'
import { User } from '../entities/user.ts'

type Params = { user: string }
type State = { session: Session }

interface BookmarkBody {
  type: 'json'
  value: {
    url: string
    privacy: PrivacyType
    title?: string
    description?: string
    tags?: string[]
  }
}

function assertBookmarkBody(input: Body): asserts input is BookmarkBody {
  if (input.type === 'json' && input.value?.url) return
  throw new Error('request `body` should least contain an `url`')
}

async function getLink(input: string): Promise<Link> {
  const url = new URL(input).toString()
  const link = await Link.findOne({ url })

  return link ?? Link.create({ url }).save()
}

async function getTags(input: string[] = []) {
  const tags: Tag[] = []

  for (const tagName of input) {
    const tag = await Tag.findOne({ name: tagName })

    tags.push(tag ?? (await Tag.create({ name: tagName }).save()))
  }

  return tags
}

export const UserBookmarkController = {
  async get({ response, params }: RouterContext<Params>) {
    try {
      const user = await User.findOne(
        { name: params.user },
        {
          select: ['id'],
          relations: ['bookmarks', 'bookmarks.link', 'bookmarks.tags'],
        }
      )

      if (user?.bookmarks?.length) {
        response.body = user.bookmarks
      } else {
        response.status = 404
        response.body = { message: '🤷‍♂️ Not found' }
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
  }: RouterContext<Params, State>) {
    try {
      const user = await User.findOne(
        { name: params.user },
        { relations: ['tags'] }
      )

      if (user?.id !== state.session.user.id) {
        response.status = 403
        response.body = { message: '🙅‍♂️ Forbidden' }
        return
      }

      const body = await request.body(JSON_BODY)

      assertBookmarkBody(body)

      const link = await getLink(body.value.url)
      const tags = await getTags(body.value.tags)
      const count = await Bookmark.count({ link, user })

      if (count === 0) {
        const bookmark = Bookmark.create({
          title: body.value.title,
          description: body.value.description,
          privacy: body.value.privacy,
          user,
          link,
          tags,
        })

        user.tags = (user.tags ?? []).concat(tags)

        await bookmark.save()
        await user.save()

        response.status = 201
        response.body = { message: '✨ Created' }
      } else {
        response.status = 409
        response.body = { message: '🙅‍♂️ Already exists' }
      }
    } catch (error) {
      console.error(error)

      response.status = 500
      response.body = { message: '😭 Something went wrong' }
    }
  },
}
