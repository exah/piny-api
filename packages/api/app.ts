import Koa from 'koa'
import { handleError } from '@piny/error/middlewares'
import { routes } from './routes'

export const app = new Koa()

app.use(handleError)
app.use(routes.middleware())
