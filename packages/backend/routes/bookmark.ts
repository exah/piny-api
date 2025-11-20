import Router from '@koa/router'
import * as Path from '../constants/path'
import * as auth from '../functions/auth'
import * as bookmark from '../functions/bookmark'

export const bookmarkRoutes = new Router()

bookmarkRoutes.get(Path.BOOKMARKS, auth.verify, bookmark.all)
bookmarkRoutes.post(Path.BOOKMARKS, auth.verify, bookmark.add)
bookmarkRoutes.get(Path.BOOKMARK_ID, auth.verify, bookmark.get)
bookmarkRoutes.patch(Path.BOOKMARK_ID, auth.verify, bookmark.edit)
bookmarkRoutes.delete(Path.BOOKMARK_ID, auth.verify, bookmark.remove)
