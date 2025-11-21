import Router from '@koa/router'
import * as auth from '@piny/session/middlewares'
import * as bookmark from '@piny/bookmark/resource'
import { Path } from '../constants'

export const bookmarkRoutes = new Router()

bookmarkRoutes.get(Path.BOOKMARKS, auth.verify, bookmark.all)
bookmarkRoutes.post(Path.BOOKMARKS, auth.verify, bookmark.add)
bookmarkRoutes.get(Path.BOOKMARK_ID, auth.verify, bookmark.get)
bookmarkRoutes.patch(Path.BOOKMARK_ID, auth.verify, bookmark.edit)
bookmarkRoutes.delete(Path.BOOKMARK_ID, auth.verify, bookmark.remove)
