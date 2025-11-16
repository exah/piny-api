import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './testing/setup.global.ts',
    setupFiles: ['./testing/setup.db.ts', './testing/setup.server.ts'],
  },
})
