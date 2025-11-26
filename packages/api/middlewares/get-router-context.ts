import Koa from 'koa'
import parse from 'co-body'
import * as v from 'valibot'
import { MessageResponseSchema } from '@piny/status/schemas'
import type { RouterContext, RouterSessionState } from '../types/router'

export const getRouterContext: Koa.Middleware<
  RouterSessionState,
  RouterContext<unknown>
> = (context, next) => {
  context.receive = async function receiveJSON(schema) {
    return v.parse(schema, await parse.json(context.request))
  }

  context.reply = function replyJSON(status, schemaOrMessage, output) {
    if (typeof schemaOrMessage === 'string') {
      context.response.status = status
      context.response.body = v.parse(MessageResponseSchema, {
        message: schemaOrMessage,
      })
    } else {
      context.response.status = status
      context.response.body = v.parse(schemaOrMessage, output)
    }
  }

  return next()
}
