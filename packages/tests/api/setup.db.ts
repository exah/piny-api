import { beforeAll, afterAll } from 'vitest'
import { dataSource } from '@piny/db/source'

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  if (!dataSource.isInitialized) {
    return
  }

  await dataSource.destroy()
})
