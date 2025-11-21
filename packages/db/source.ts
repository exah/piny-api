import * as path from 'node:path'
import { DataSource } from 'typeorm'
import { ENTITIES_REGISTRY } from './entities'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: path.join(import.meta.dirname, '../../db/piny.db'),
  entities: ENTITIES_REGISTRY,
})
