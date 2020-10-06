import Koa from 'koa'
import { handleError } from './middleware/handle-error'
import { router } from './router'

export const app = new Koa()

app.use(handleError)
app.use(router.routes())
app.use(router.allowedMethods())
