import { defineConfig } from 'vitest/config'
import { join, dirname } from 'node:path'

const resolve = (file: string) => join(import.meta.dirname, file)
const routesURL = new URL(import.meta.resolve('@piny/backend/routes'))

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: '@piny/backend/routes',
          root: dirname(routesURL.pathname),
          globalSetup: resolve('./api/setup.global.ts'),
          setupFiles: [
            resolve('./api/setup.db.ts'),
            resolve('./api/setup.server.ts'),
          ],
        },
        extends: true,
      },
    ],
  },
})
