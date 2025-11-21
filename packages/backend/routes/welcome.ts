import Router from '@koa/router'
import * as welcome from '@piny/welcome/resource'
import { Path } from '../constants'

export const welcomeRoutes = new Router()

welcomeRoutes.get(Path.WELCOME, welcome.get)
