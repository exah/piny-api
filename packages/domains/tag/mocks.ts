import { faker } from '@faker-js/faker'
import { dataSource } from '@piny/db/source'
import type { UserEntity } from '@piny/user/entities'
import { getOrCreateTags } from './functions'

export function createTagsListMock(
  tags: string[] = Array(faker.number.int({ min: 1, max: 12 })).fill(undefined),
  user: UserEntity,
  manager = dataSource.manager
) {
  return getOrCreateTags(
    tags.map((tag) => tag ?? faker.string.nanoid()),
    user,
    manager
  )
}
