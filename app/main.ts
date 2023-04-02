import Koa from 'koa'
import { handleError } from './middleware/handle-error'
import { authRoutes } from './routes/auth'
import { bookmarkRoutes } from './routes/bookmark'
import { userRoutes } from './routes/user'

export const main = new Koa()

main.use(handleError)

main.use(authRoutes.routes())
main.use(authRoutes.allowedMethods())

main.use(bookmarkRoutes.routes())
main.use(bookmarkRoutes.allowedMethods())

main.use(userRoutes.routes())
main.use(userRoutes.allowedMethods())
