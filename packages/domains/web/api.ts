import * as YF from 'ya-fetch'
import * as v from 'valibot'
import { InternalServerError } from '@piny/status/errors'
import { getServerHostPort, getServerURL } from '@piny/api/config'
import { ErrorResponseSchema } from '@piny/status/schemas'
import { getErrorByCode } from '@piny/status/utils'

export const api = YF.create({
  base: getServerURL(getServerHostPort()),
  async onRequest(_, options) {
    const requestId = crypto.randomUUID()
    options.headers.set('X-Request-ID', requestId)
  },
  async onFailure(error) {
    if (error instanceof YF.ResponseError) {
      const json = await error.response.json()
      const data = await v.parseAsync(ErrorResponseSchema, json)
      const responseError = new (getErrorByCode(data.code))()

      responseError.id = data.id
      responseError.url = new URL(error.response.url)
      responseError.meta = data.meta
      responseError.cause = error
      responseError.method = error.response.options.method
      responseError.message = data.message
      responseError.headers = error.response.options.headers
      responseError.payload = error.response.options.json

      throw responseError
    }

    throw new InternalServerError()
  },
})
