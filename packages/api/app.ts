import Koa from 'koa'
import logger from 'koa-pino-logger'
import pretty from 'pino-pretty'
import { catchErrors } from '@piny/status/middlewares'
import { routes } from './routes'
import { getRouterContext } from './middlewares'
import type { RouterSessionState, RouterContext } from './types/router'

export const app = new Koa<RouterSessionState, RouterContext<unknown>>()

app.use(
  logger(
    pretty({
      colorize: true,
      hideObject: true,
      minimumLevel: 'error',
    })
  )
)

app.use(getRouterContext)
app.use(catchErrors)
app.use(routes.middleware())
