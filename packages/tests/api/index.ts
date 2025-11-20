import * as YF from 'ya-fetch'
import { inject } from 'vitest'
import { getServerURL } from '@piny/api/config'

export const api = YF.create({
  base: getServerURL(inject('server')).toString(),
})
