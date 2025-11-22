import { defineConfig } from 'vitest/config'
import { join, dirname } from 'node:path'

const resolve = (file: string) => join(import.meta.dirname, file)
const routesURL = new URL(import.meta.resolve('@piny/api/routes'))

export default defineConfig({
  test: {
    name: '@piny/api/routes',
    root: dirname(routesURL.pathname),
    globalSetup: resolve('./setup.global.ts'),
    setupFiles: [resolve('./setup.db.ts'), resolve('./setup.server.ts')],
  },
})
