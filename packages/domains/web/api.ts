import * as YF from 'ya-fetch'
import * as v from 'valibot'
import { SomethingWentWrong } from '@piny/status/errors'
import { ERRORS_REGISTRY } from '@piny/status/registry'
import { ensure } from '@piny/tools/assert'
import { getServerHostPort, getServerURL } from '@piny/api/config'
import { ErrorResponseSchema } from '@piny/status/schemas'

export const api = YF.create({
  base: getServerURL(getServerHostPort()),
  async onRequest(_, options) {
    const requestId = crypto.randomUUID()
    options.headers.set('X-Request-ID', requestId)
  },
  async onFailure(error) {
    if (error instanceof YF.ResponseError) {
      const json = await error.response.json()
      const parsed = await v.parseAsync(ErrorResponseSchema, json)

      const ResponseError = ensure(
        ERRORS_REGISTRY.find((item) => item.code === parsed.code)
      )

      throw new ResponseError(parsed.message, {
        id: parsed.id,
        url: new URL(error.response.url),
        meta: parsed.meta,
        cause: error,
      })
    }

    throw new SomethingWentWrong()
  },
})
