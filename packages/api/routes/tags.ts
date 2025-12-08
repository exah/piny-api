import Router from '@koa/router'
import * as tag from '@piny/tag/resource'
import { Path } from '../constants'
import { authorized } from '../middlewares'

export const tagRoutes = new Router()

tagRoutes.get(Path.TAGS, authorized, tag.getTags)
