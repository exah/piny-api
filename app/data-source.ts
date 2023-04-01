import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db/piny.db',
  entities: ['app/entities/**/*'],
})

await dataSource.initialize()
