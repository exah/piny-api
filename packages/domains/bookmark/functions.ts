import * as orm from 'typeorm'
import { match } from 'lil-match'
import { NotFoundError } from '@piny/status/errors'
import type { UserEntity } from '@piny/user/entities'
import type { UserType } from '@piny/user/types'
import { Privacy, State } from './constants'
import { BookmarkEntity } from './entities'

export async function getUserBookmarks(user: UserEntity, userType: UserType) {
  const bookmarks = await BookmarkEntity.find({
    where: {
      user: { id: user.id },
      state: State.active,
      privacy: match(userType)
        .with('current', () => orm.In([Privacy.public, Privacy.private]))
        .with('other', () => orm.In([Privacy.public]))
        .exhaustive('Unhandled user type'),
    },
    relations: { link: true, bookmarkTags: { tag: true } },
    order: { createdAt: 'DESC', bookmarkTags: { order: 'ASC' } },
  })

  if (bookmarks.length === 0 && userType === 'other') {
    throw new NotFoundError()
  }

  return bookmarks.map((bookmark) => ({
    ...bookmark,
    tags: bookmark.bookmarkTags.map(({ tag }) => tag),
  }))
}
