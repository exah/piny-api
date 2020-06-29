import { RouterContext } from 'https://deno.land/x/oak/mod.ts'
import { PrivacyType } from '../constants.ts'
import { User } from '../entities/user.ts'
import { Link } from '../entities/link.ts'
import { Bookmark } from '../entities/bookmark.ts'

export const UserBookmarkController = {
  async get({ response, params }: RouterContext<{ user: string }>) {
    try {
      const user = await User.findOne(
        { name: params.user },
        { relations: ['bookmarks', 'bookmarks.link'] }
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
      response.body = { message: error.message }
    }
  },
  async add({ request, response, params }: RouterContext<{ user: string }>) {
    try {
      const body = await request.body({
        contentTypes: {
          json: ['application/json'],
        },
      })

      const url = new URL(body.value.url).toString()
      const linkCount = await Link.count({ url })

      if (linkCount === 0) {
        const link = new Link()

        link.url = url
        await link.save()
      }

      const user = await User.findOne({ name: params.user })
      const link = await Link.findOne({ url })

      const bookmarkCount = await Bookmark.count({ link })

      if (bookmarkCount === 0 && user != null && link != null) {
        const bookmark = new Bookmark()

        bookmark.title = body.value.title
        bookmark.privacy = PrivacyType.public
        bookmark.user = user
        bookmark.link = link

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
      response.body = { message: error.message }
    }
  },
}
