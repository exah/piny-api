import Koa from 'koa'
import { catchErrors } from '@piny/error/middlewares'
import { routes } from './routes'

export const app = new Koa()

app.use(catchErrors)
app.use(routes.middleware())
