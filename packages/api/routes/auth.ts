import Router from '@koa/router'
import * as auth from '@piny/session/resource'
import { Path } from '../constants'
import { authorized } from '../middlewares'

export const authRoutes = new Router()

authRoutes.post(Path.SIGNUP, auth.signup)
authRoutes.post(Path.LOGIN, auth.login)
authRoutes.post(Path.LOGOUT, auth.logout)
authRoutes.post(Path.REFRESH_SESSION, authorized, auth.refreshSession)

/** @deprecated Use `POST /logout` */
authRoutes.get(Path.LOGOUT, auth.logout)
