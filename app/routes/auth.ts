import Router from '@koa/router'
import * as Path from '../constants/path'
import * as auth from '../functions/auth'

export const authRoutes = new Router()

authRoutes.post(Path.SIGNUP, auth.signup)
authRoutes.post(Path.LOGIN, auth.login)
authRoutes.get(Path.LOGOUT, auth.logout)
