import Router from '@koa/router'
import * as Path from '../constants/path'
import * as welcome from '../functions/welcome'

export const welcomeRoutes = new Router()

welcomeRoutes.get(Path.WELCOME, welcome.get)
