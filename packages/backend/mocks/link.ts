import { faker } from '@faker-js/faker'
import { Link } from '@piny/link/entity'

export function createLinkMock(url = faker.internet.url()) {
  const link = Link.create({
    url,
  })

  return link.save()
}
