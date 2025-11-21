import { beforeAll, afterAll } from 'vitest'
import { DataSource } from 'typeorm'
import { ENTITIES_REGISTRY } from '@piny/db/entities'

const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: ENTITIES_REGISTRY,
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
