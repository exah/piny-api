import { beforeAll, afterAll } from 'vitest'
import { DataSource } from 'typeorm'
import { ENTITIES } from '@piny/backend/entities'

const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: ENTITIES,
  dropSchema: true,
  synchronize: true,
  logging: false,
})

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  if (!dataSource.isInitialized) {
    return
  }

  await dataSource.destroy()
})
