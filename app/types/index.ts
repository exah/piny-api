import { RouterContext as BaseRouterContext } from '@koa/router'

export interface RouterContext<P = any, S = {}> extends BaseRouterContext<S> {
  params: P
}
