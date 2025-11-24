import { LinkEntity } from './entities'

export async function getLinkForURL(linkURL: string): Promise<LinkEntity> {
  const url = new URL(linkURL)

  const foundLink = await LinkEntity.findOne({
    where: { url: url.toString() },
  })

  const link = foundLink ?? LinkEntity.create({ url: url.toString() })

  return link.save()
}
