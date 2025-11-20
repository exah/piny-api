import * as path from 'node:path'
import { DataSource } from 'typeorm'
import { ENTITIES } from '@piny/backend/entities'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: path.join(import.meta.dirname, '../../db/piny.db'),
  entities: ENTITIES,
})

await dataSource.initialize()
