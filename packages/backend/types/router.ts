import { RouterContext as BaseRouterContext } from '@koa/router'

export interface RouterContext<Params = unknown, State = unknown>
  extends Omit<BaseRouterContext, 'params' | 'state'> {
  params: Params
  state: State
}
