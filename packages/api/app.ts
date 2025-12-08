import Koa from 'koa'
import { logger } from '@piny/tools/logger'
import { ResponseError } from '@piny/status/errors'
import { routes } from './routes'
import { getRouterContext, catchErrors } from './middlewares'
import type { RouterSessionState, RouterContext } from './types/router'

export const app = new Koa<RouterSessionState, RouterContext<unknown>>()

app.use(getRouterContext)
app.use(catchErrors)
app.use(routes.middleware())
app.on('error', (error: unknown) => {
  if (
    ['test'].includes(process.env.NODE_ENV || '') &&
    !['test', '*'].includes(process.env.DEBUG || '') &&
    error instanceof ResponseError &&
    error.status !== 500
  ) {
    return
  }

  if (error instanceof ResponseError) {
    logger.error({ ...error }, error.message)
    return
  }

  if (error instanceof Error) {
    logger.error(error, `🔴 ${error.message}`)
    return
  }

  logger.error(error)
})
