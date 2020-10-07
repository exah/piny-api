import Router from '@koa/router'

import { Routes } from './constants'
import { AuthController } from './controllers/auth'
import { WelcomeController } from './controllers/welcome'
import { UserController } from './controllers/user'
import { BookmarkController } from './controllers/bookmark'
import { UserTagController } from './controllers/user-tag'

export const router = new Router()

router
  .get(Routes.WELCOME, WelcomeController.get)
  .post(Routes.SIGNUP, AuthController.signup)
  .post(Routes.LOGIN, AuthController.login)
  .get(Routes.LOGOUT, AuthController.logout)
  .get(Routes.BOOKMARKS, AuthController.verify, BookmarkController.all)
  .post(Routes.BOOKMARKS, AuthController.verify, BookmarkController.add)
  .get(Routes.BOOKMARK, AuthController.verify, BookmarkController.get)
  .patch(Routes.BOOKMARK, AuthController.verify, BookmarkController.edit)
  .delete(Routes.BOOKMARK, AuthController.verify, BookmarkController.remove)
  .get(Routes.USER, AuthController.verify, UserController.get)
  .get(Routes.USER_BOOKMARKS, AuthController.session, BookmarkController.all)
  .get(Routes.USER_TAGS, AuthController.verify, UserTagController.all)
