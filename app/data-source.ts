import { DataSource } from 'typeorm'
import { ENTITIES } from './entities'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db/piny.db',
  entities: ENTITIES,
})

await dataSource.initialize()
