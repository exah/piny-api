import Router from '@koa/router'
import { welcomeRoutes } from './welcome'
import { authRoutes } from './auth'
import { bookmarkRoutes } from './bookmark'
import { userRoutes } from './user'
import { tagRoutes } from './tags'

export const routes = new Router()

routes.use(welcomeRoutes.routes())
routes.use(welcomeRoutes.allowedMethods())

routes.use(authRoutes.routes())
routes.use(authRoutes.allowedMethods())

routes.use(bookmarkRoutes.routes())
routes.use(bookmarkRoutes.allowedMethods())

routes.use(tagRoutes.routes())
routes.use(tagRoutes.allowedMethods())

routes.use(userRoutes.routes())
routes.use(userRoutes.allowedMethods())
