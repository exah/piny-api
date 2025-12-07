import { faker } from '@faker-js/faker'
import type { UserEntity } from '@piny/user/entities'
import { transaction } from '@piny/db/transaction'
import { getOrCreateTags } from './functions'

export function createTagsListMock(
  tags: string[] = Array(faker.number.int({ min: 1, max: 12 })).fill(undefined),
  user: UserEntity
) {
  return transaction(() =>
    getOrCreateTags(
      tags.map((tag) => tag ?? faker.string.nanoid()),
      user
    )
  )
}
