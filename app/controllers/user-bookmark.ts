import { RouterContext, Body } from 'https://deno.land/x/oak/mod.ts'
import { PrivacyType } from '../constants.ts'
import { User } from '../entities/user.ts'
import { Link } from '../entities/link.ts'
import { Bookmark } from '../entities/bookmark.ts'

interface BookmarkBody {
  type: 'json'
  value: {
    url: string
    privacy: PrivacyType
    title?: string
    description?: string
  }
}

function assertBookmarkBody(input: Body): asserts input is BookmarkBody {
  if (input.type === 'json' && input.value?.url) return
  throw new Error('request `body` should least contain an `url`')
}

export const UserBookmarkController = {
  async get({ response, params }: RouterContext<{ user: string }>) {
    try {
      const user = await User.findOne(
        { name: params.user },
        { select: ['id'], relations: ['bookmarks', 'bookmarks.link'] }
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
  async add({ request, response, params }: RouterContext<{ user: string }>) {
    try {
      const body = await request.body({
        contentTypes: { json: ['application/json'] },
      })

      assertBookmarkBody(body)

      const url = new URL(body.value.url).toString()
      const linkCount = await Link.count({ url })

      if (linkCount === 0) {
        const link = Link.create({ url })
        await link.save()
      }

      const user = await User.findOne({ name: params.user })
      const link = await Link.findOne({ url })

      const bookmarkCount = await Bookmark.count({ link, user })

      if (bookmarkCount === 0) {
        const bookmark = Bookmark.create({
          title: body.value.title,
          description: body.value.description,
          privacy: body.value.privacy,
          user: user,
          link: link,
        })

        await bookmark.save()

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
