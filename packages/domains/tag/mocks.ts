import { faker } from '@faker-js/faker'
import { TagEntity } from './entities'

export function createTagMock(name = faker.string.nanoid()) {
  const tag = TagEntity.create({
    name,
  })

  return tag.save()
}

export function createTagsListMock(
  tags: string[] = Array(faker.number.int({ min: 0, max: 12 })).fill(undefined)
) {
  return Promise.all(tags.map((name) => createTagMock(name)))
}
