import { beforeAll, afterAll, inject } from 'vitest'
import type { Server } from 'node:http'
import { app } from '@piny/api/app'

let server: Server

beforeAll(() => {
  server = app.listen(inject('server'))
})

afterAll(() => {
  server.close()
})
