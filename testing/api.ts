import * as YF from 'ya-fetch'
import { getServerURL } from '../app/utils/get-server-config'
import { inject } from 'vitest'

export const api = YF.create({
  base: getServerURL(inject('server')).toString(),
})
