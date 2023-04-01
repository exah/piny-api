import Router from '@koa/router'
import * as Path from './constants/paths'
import * as auth from './functions/auth'
import * as welcome from './functions/welcome'
import * as user from './functions/user'
import * as bookmark from './functions/bookmark'
import * as userTag from './functions/user-tag'

export const router = new Router()

router
  .get(Path.WELCOME, welcome.get)
  .post(Path.SIGNUP, auth.signup)
  .post(Path.LOGIN, auth.login)
  .get(Path.LOGOUT, auth.logout)
  .get(Path.BOOKMARKS, auth.verify, bookmark.all)
  .post(Path.BOOKMARKS, auth.verify, bookmark.add)
  .get(Path.BOOKMARK, auth.verify, bookmark.get)
  .patch(Path.BOOKMARK, auth.verify, bookmark.edit)
  .delete(Path.BOOKMARK, auth.verify, bookmark.remove)
  .get(Path.USER, auth.verify, user.get)
  .get(Path.USER_BOOKMARKS, auth.session, bookmark.all)
  .get(Path.USER_TAGS, auth.verify, userTag.all)
