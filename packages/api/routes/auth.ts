import Router from '@koa/router'
import * as auth from '@piny/session/resource'
import { Path } from '../constants'

export const authRoutes = new Router()

authRoutes.post(Path.SIGNUP, auth.signup)
authRoutes.post(Path.LOGIN, auth.login)
authRoutes.get(Path.LOGOUT, auth.logout)
