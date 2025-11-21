import Router from '@koa/router'
import * as auth from '@piny/session/middlewares'
import * as tag from '@piny/tag/resource'
import { Path } from '../constants'

export const tagRoutes = new Router()

tagRoutes.get(Path.TAGS, auth.verify, tag.all)
