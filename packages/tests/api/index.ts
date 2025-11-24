import { inject } from 'vitest'
import { getServerURL } from '@piny/api/config'
import * as web from '@piny/web/api'

export const api = web.api.extend({
  base: getServerURL(inject('server')).toString(),
})
