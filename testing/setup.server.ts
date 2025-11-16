import { beforeAll, afterAll, inject } from 'vitest'
import type { Server } from 'node:http'
import { main } from '../app/main'

let server: Server

beforeAll(() => {
  server = main.listen(inject('server'))
})

afterAll(() => {
  server.close()
})
