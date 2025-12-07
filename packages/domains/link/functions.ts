import { manager } from '@piny/db/transaction'
import { LinkEntity } from './entities'

export async function getLinkForURL(linkURL: string): Promise<LinkEntity> {
  const url = new URL(linkURL)

  const link = await manager().findOne(LinkEntity, {
    where: { url: url.toString() },
  })

  return link ?? (await manager().save(LinkEntity.create({ url: url.toString() })))
}
