import { createConnection } from 'https://denolib.com/denolib/typeorm@v0.2.23-rc5/mod.ts'

await createConnection({
  type: 'sqlite',
  database: 'db/piny.db',
  synchronize: true,
  entities: ['app/entities/**/*.ts'],
  migrations: ['app/migrations/**/*.ts'],
  subscribers: ['app/subscribers/**/*.ts'],
})
