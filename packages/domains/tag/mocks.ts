import { faker } from '@faker-js/faker'
import type { UserEntity } from '@piny/user/entities'
import { TagEntity } from './entities'

export async function createTagMock(
  name = faker.string.nanoid(),
  user?: UserEntity
) {
  const tag = TagEntity.create({
    name,
    users: user ? [user] : [],
  })

  return tag.save()
}

export function createTagsListMock(
  tags: string[] = Array(faker.number.int({ min: 0, max: 12 })).fill(undefined),
  user?: UserEntity
) {
  return Promise.all(tags.map((name) => createTagMock(name, user)))
}
