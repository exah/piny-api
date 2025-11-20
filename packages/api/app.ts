import Koa from 'koa'
import { handleError } from '@piny/backend/middleware'
import { routes } from '@piny/backend/routes'

export const app = new Koa()

app.use(handleError)
app.use(routes.middleware())
