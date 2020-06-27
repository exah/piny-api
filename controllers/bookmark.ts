import { generate } from 'https://deno.land/std/uuid/v4.ts'
import { RouterContext } from 'https://deno.land/x/oak/mod.ts'
import { UserModel, LinkModel, BookmarkModel } from '../models.ts'

export async function getBookmarks({
  response,
  params,
}: RouterContext<{ user: string }>) {
  try {
    const user = await UserModel.where('name', params.user).first()
    const result = await UserModel.where('id', user.id).bookmarks()

    for (const bookmark of result) {
      delete bookmark.user
      bookmark.link = await LinkModel.find(bookmark.link)
    }

    response.body = result
  } catch (error) {
    console.error(error)

    response.status = 500
    response.body = { message: error.message }
  }
}

export async function addBookmark({
  request,
  response,
  params,
}: RouterContext<{ user: string }>) {
  try {
    const body = await request.body({
      contentTypes: {
        json: ['application/json'],
      },
    })

    const url = new URL(body.value.url).toString()
    const linkCount = await LinkModel.where('url', url).count()

    if (linkCount === 0) {
      await LinkModel.create({
        id: generate(),
        url,
      })
    }

    const user = await UserModel.where('name', params.user).first()
    const link = await LinkModel.where('url', url).first()

    const bookmarkCount = await BookmarkModel.where('link', link.id).count()

    if (bookmarkCount === 0) {
      await BookmarkModel.create({
        id: generate(),
        title: body.value.title,
        user: user.id,
        link: link.id,
      })

      response.body = { message: 'created' }
    } else {
      response.body = { message: 'already exists' }
    }
  } catch (error) {
    console.error(error)

    response.status = 500
    response.body = { message: error.message }
  }
}
