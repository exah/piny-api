import * as path from 'node:path'
import { DataSource } from 'typeorm'
import { ENTITIES_REGISTRY } from './entities'

export const dataSource = new DataSource({
  type: 'sqlite',
  synchronize: false,
  database: path.join(import.meta.dirname, '../../db/piny.db'),
  entities: ENTITIES_REGISTRY,
  migrations: [path.join(import.meta.dirname, './migrations/*.ts')],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
})
