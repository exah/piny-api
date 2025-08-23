import Router from '@koa/router'
import * as Path from '../constants/path'
import * as auth from '../functions/auth'
import * as tag from '../functions/tag'

export const tagRoutes = new Router()

tagRoutes.get(Path.TAGS, auth.verify, tag.all)
