import { logger } from '@piny/tools/logger'
import type { IncomingHttpHeaders } from 'node:http'
import Koa from 'koa'
import parse from 'co-body'
import * as v from 'valibot'
import { RequestIdSchema, MessageResponseSchema } from '@piny/status/schemas'
import type { RouterContext, RouterSessionState } from '../types/router'

function getHeaderRequestId(headers: IncomingHttpHeaders) {
  const value = headers['x-request-id']
  return v.parseAsync(
    RequestIdSchema,
    (Array.isArray(value) ? value.at(-1) : value) ?? crypto.randomUUID()
  )
}

export const getRouterContext: Koa.Middleware<
  RouterSessionState,
  RouterContext<unknown>
> = async (context, next) => {
  context.requestId = await getHeaderRequestId(context.request.headers)
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

  const routeLogger = logger.child({
    method: context.request.method,
    url: context.request.url,
    ip: context.request.ip,
    path: context.request.path,
    query: context.request.query,
    requestId: context.requestId,
  })

  routeLogger.info(
    { headers: context.request.headers },
    `➡️  ${context.request.method} ${context.request.path}`
  )

  await next()

  routeLogger.info(
    {
      status: context.response.status,
      headers: context.response.headers,
    },
    v.is(MessageResponseSchema, context.response.body)
      ? `⬅️  ${context.request.method} ${context.request.path} - ${context.response.status} (${context.response.body.message})`
      : `⬅️  ${context.request.method} ${context.request.path} - ${context.response.status}`
  )
}
