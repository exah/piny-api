import { dataSource } from './source'

await dataSource.initialize()
await dataSource.showMigrations()
await dataSource.runMigrations()
