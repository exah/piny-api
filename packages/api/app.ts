import Koa from 'koa'
import logger from 'koa-pino-logger'
import pretty from 'pino-pretty'
import { catchErrors } from '@piny/error/middlewares'
import { routes } from './routes'

export const app = new Koa()

app.use(
  logger(
    pretty({
      colorize: true,
      hideObject: true,
      minimumLevel: 'error',
    })
  )
)

app.use(catchErrors)
app.use(routes.middleware())
