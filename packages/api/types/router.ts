import { RouterContext as BaseRouterContext } from '@koa/router'
import type { Session } from '@piny/session/entities'

export interface RouterContext<Params extends Record<string, string> = {}>
  extends BaseRouterContext<RouterSessionState> {
  params: Params
}

export interface RouterSessionState {
  session: Session | undefined
}
