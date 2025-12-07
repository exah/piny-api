import { faker } from '@faker-js/faker'
import { dataSource } from '@piny/db/source'
import { LinkEntity } from './entities'

export function createLinkMock(
  url = faker.internet.url(),
  manager = dataSource.manager
) {
  const link = LinkEntity.create({
    url: new URL(url).toString(),
  })

  return manager.save(link)
}
