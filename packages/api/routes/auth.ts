import Router from '@koa/router'
import * as auth from '@piny/session/resource'
import { verify } from '@piny/session/middlewares'
import { Path } from '../constants'

export const authRoutes = new Router()

authRoutes.post(Path.SIGNUP, auth.signup)
authRoutes.post(Path.LOGIN, auth.login)
authRoutes.post(Path.LOGOUT, auth.logout)
authRoutes.post(Path.REFRESH_SESSION, verify, auth.refreshSession)

/** @deprecated Use `POST /logout` */
authRoutes.get(Path.LOGOUT, auth.logout)
