import Router from '@koa/router'
import * as bookmark from '@piny/bookmark/resource'
import * as tag from '@piny/tag/resource'
import * as user from '@piny/user/resource'
import { Path } from '../constants'
import { authorized } from '../middlewares'

export const userRoutes = new Router()

userRoutes.get(Path.USER, authorized, user.getUser)
userRoutes.get(Path.USER_BOOKMARKS, bookmark.all)
userRoutes.get(Path.USER_TAGS, tag.getTags)
