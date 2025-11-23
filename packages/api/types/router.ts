import type * as Koa from '@koa/router'
import type { SessionEntity } from '@piny/session/entities'

export interface RouterContext<
  Response = never,
  Params extends Record<string, string> = {},
  State = RouterSessionState
> extends Koa.RouterContext<State, unknown, Response> {
  params: Params
}

export interface RouterSessionState {
  session: SessionEntity | undefined
}
