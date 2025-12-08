import Router from '@koa/router'
import * as bookmark from '@piny/bookmark/resource'
import { Path } from '../constants'
import { authorized } from '../middlewares'

export const bookmarkRoutes = new Router()

bookmarkRoutes.get(Path.BOOKMARKS, authorized, bookmark.all)
bookmarkRoutes.post(Path.BOOKMARKS, authorized, bookmark.add)
bookmarkRoutes.get(Path.BOOKMARK_ID, authorized, bookmark.get)
bookmarkRoutes.patch(Path.BOOKMARK_ID, authorized, bookmark.edit)
bookmarkRoutes.delete(Path.BOOKMARK_ID, authorized, bookmark.remove)
