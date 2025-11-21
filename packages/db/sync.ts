import { dataSource } from './source'

await dataSource.initialize()
await dataSource.synchronize()
