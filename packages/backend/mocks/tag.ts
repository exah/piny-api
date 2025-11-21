import { faker } from '@faker-js/faker'
import { Tag } from '@piny/tag/entity'

export function createTagMock(name = faker.string.nanoid()) {
  const tag = Tag.create({
    name,
  })

  return tag.save()
}

export function createTagsListMock(
  tags: string[] = Array(faker.number.int({ min: 0, max: 12 })).fill(undefined)
) {
  return Promise.all(tags.map((name) => createTagMock(name)))
}
