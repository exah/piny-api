import Koa from 'koa'
import { catchErrors } from '@piny/status/middlewares'
import { routes } from './routes'
import { getRouterContext } from './middlewares'
import type { RouterSessionState, RouterContext } from './types/router'

export const app = new Koa<RouterSessionState, RouterContext<unknown>>()

app.use(getRouterContext)
app.use(catchErrors)
app.use(routes.middleware())
app.on('error', (error: unknown) => console.error(error))
