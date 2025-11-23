import Koa from 'koa'
import parse from 'co-body'
import * as v from 'valibot'
import type { RouterContext, RouterSessionState } from '../types/router'

export const getRouterContext: Koa.Middleware<
  RouterSessionState,
  RouterContext<unknown>
> = (context, next) => {
  context.receive = async function receiveJSON(schema) {
    return v.parse(schema, await parse.json(this.request))
  }

  context.reply = function replyJSON(status, schema, output) {
    context.response.status = status
    context.response.body = v.parse(schema, output)
  }

  return next()
}
