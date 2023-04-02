import Router from '@koa/router'
import * as Path from '../constants/path'
import * as auth from '../functions/auth'
import * as user from '../functions/user'
import * as bookmark from '../functions/bookmark'
import * as userTag from '../functions/user-tag'

export const userRoutes = new Router()

userRoutes.get(Path.USER, auth.verify, user.get)
userRoutes.get(Path.USER_BOOKMARKS, auth.session, bookmark.all)
userRoutes.get(Path.USER_TAGS, auth.verify, userTag.all)
