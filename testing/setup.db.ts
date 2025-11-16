import { beforeAll, afterAll } from 'vitest'
import { DataSource } from 'typeorm'
import { Session } from '../app/entities/session'
import { User } from '../app/entities/user'
import { Tag } from '../app/entities/tag'
import { Bookmark } from '../app/entities/bookmark'
import { Link } from '../app/entities/link'

const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [Session, User, Tag, Bookmark, Link],
  dropSchema: true,
  synchronize: true,
  logging: false,
})

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  if (!dataSource.isInitialized) {
    return
  }

  await dataSource.destroy()
})
