import type { TestProject } from 'vitest/node'
import { getServerHostPort } from '../app/utils/get-server-config'

export function setup(project: TestProject) {
  let { port, host } = getServerHostPort()

  project.provide('server', {
    host,
    get port() {
      return port++
    },
  })
}

declare module 'vitest' {
  export interface ProvidedContext {
    server: {
      port: number
      host: string
    }
  }
}
