import * as orm from 'typeorm'
import type { UserEntity } from '@piny/user/entities'
import type { UserType } from '@piny/user/types'
import { match } from 'lil-match'
import { Privacy } from '@piny/bookmark/constants'
import { TagEntity } from './entities'

export async function getUserTags(user: UserEntity, type: UserType) {
  const tags = await TagEntity.find({
    select: ['id', 'name'],
    where: {
      users: [{ id: user.id }],
      bookmarkTags: match(type)
        .with('other', () => ({
          bookmark: { privacy: Privacy.public },
        }))
        .with('current', () => ({
          bookmark: { privacy: orm.In([Privacy.public, Privacy.private]) },
        }))
        .exhaustive('Unhandled user type'),
    },
  })

  return tags
}

export async function getOrCreateTags(input: string[] = [], user: UserEntity) {
  const nextTags: TagEntity[] = []
  const foundTags = await TagEntity.find({
    where: { name: orm.In(input) },
    relations: { users: true },
  })

  for (const name of input) {
    const foundTag = foundTags.find((tag) => tag.name === name)
    const tag = foundTag ?? TagEntity.create({ name })

    if (tag.users === undefined) {
      tag.users = [user]
    } else if (!tag.users.some((tagUser) => tagUser.id === user.id)) {
      tag.users.push(user)
    }

    nextTags.push(await tag.save())
  }

  return nextTags
}
