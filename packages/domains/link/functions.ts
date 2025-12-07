import type { EntityManager } from 'typeorm'
import { dataSource } from '@piny/db/source'
import { LinkEntity } from './entities'

export async function getLinkForURL(
  linkURL: string,
  manager: EntityManager = dataSource.manager
): Promise<LinkEntity> {
  const url = new URL(linkURL)

  const foundLink = await manager.findOne(LinkEntity, {
    where: { url: url.toString() },
  })

  const link = foundLink ?? LinkEntity.create({ url: url.toString() })

  return manager.save(link)
}
