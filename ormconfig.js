const isTS = Boolean(process[Symbol.for('ts-node.register.instance')])
const base = isTS ? 'app' : 'out/app'

module.exports = {
  type: 'sqlite',
  database: 'db/piny.db',
  entities: [`${base}/entities/**/*`],
  migrations: [`${base}/migrations/**/*`],
  subscribers: [`${base}/subscribers/**/*`],
}
