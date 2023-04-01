import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db/piny.db',
  entities: ['app/entities/**/*'],
  migrations: ['app/migrations/**/*'],
  subscribers: ['app/subscribers/**/*'],
})

await dataSource.initialize()
