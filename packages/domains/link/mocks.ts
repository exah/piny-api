import { faker } from '@faker-js/faker'
import { LinkEntity } from './entities'

export function createLinkMock(url = faker.internet.url()) {
  const link = LinkEntity.create({
    url,
  })

  return link.save()
}
