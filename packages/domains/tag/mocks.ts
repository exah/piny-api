import { faker } from '@faker-js/faker'
import type { UserEntity } from '@piny/user/entities'
import { getOrCreateTags } from './functions'

export function createTagsListMock(
  tags: string[] = Array(faker.number.int({ min: 1, max: 12 })).fill(undefined),
  user: UserEntity
) {
  return getOrCreateTags(
    tags.map(() => faker.string.nanoid()),
    user
  )
}
