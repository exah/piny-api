import type * as Koa from '@koa/router'
import type * as v from 'valibot'
import type { SessionEntity } from '@piny/session/entities'
import type { MessageResponse } from '@piny/status/types'

export interface RouterContext<
  Response = never,
  Params extends Record<string, string> = Record<string, string>,
  State = RouterSessionState
> extends Koa.RouterContext<State, unknown, Response> {
  params: Params
  receive<const S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
    schema: S
  ): Promise<v.InferOutput<S>>
  reply: Response extends Strict<MessageResponse>
    ? (status: number, message: string) => void
    : <const S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
        status: number,
        schema: S,
        output: Response | v.InferInput<S>
      ) => void
}

export interface RouterSessionState {
  session: SessionEntity | undefined
}
