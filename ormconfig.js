module.exports = {
  type: 'sqlite',
  database: 'db/piny.db',
  entities: ['app/entities/**/*'],
  migrations: ['app/migrations/**/*'],
  subscribers: ['app/subscribers/**/*'],
}
