import Router from '@koa/router'
import * as auth from '@piny/session/middlewares'
import * as bookmark from '@piny/bookmark/resource'
import * as tag from '@piny/tag/resource'
import * as user from '@piny/user/resource'
import { Path } from '../constants'

export const userRoutes = new Router()

userRoutes.get(Path.USER, auth.verify, user.getUser)
userRoutes.get(Path.USER_BOOKMARKS, auth.session, bookmark.all)
userRoutes.get(Path.USER_TAGS, auth.session, tag.getTags)
