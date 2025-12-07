import { faker } from '@faker-js/faker'
import { transaction } from '@piny/db/transaction'
import { LinkEntity } from './entities'

export function createLinkMock(url = faker.internet.url()) {
  const link = LinkEntity.create({
    url: new URL(url).toString(),
  })

  return transaction((manager) => manager.save(link))
}
