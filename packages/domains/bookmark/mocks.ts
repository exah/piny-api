import { faker } from '@faker-js/faker'
import { dataSource } from '@piny/db/source'
import { createUserMock } from '@piny/user/mocks'
import { createLinkMock } from '@piny/link/mocks'
import { createTagsListMock } from '@piny/tag/mocks'
import { BookmarkEntity, BookmarkTagEntity } from './entities'
import type { TagEntity } from '@piny/tag/entities'

interface BookmarkMock
  extends Partial<
    Pick<
      BookmarkEntity,
      'title' | 'description' | 'state' | 'privacy' | 'link' | 'user'
    >
  > {
  linkURL?: string
  tagsList?: string[]
  tags?: TagEntity[]
}

export async function createBookmarkMock({
  user: mockedUser,
  title = faker.lorem.lines(1),
  description = faker.lorem.lines(2),
  link: mockedLink,
  state = 'active',
  privacy = 'public',
  tags: mockedTags,
  linkURL,
  tagsList,
}: BookmarkMock = {}) {
  // TODO: Support transactions
  const user = mockedUser ?? (await createUserMock())
  const link = mockedLink ?? (await createLinkMock(linkURL))
  const tags = mockedTags ?? (await createTagsListMock(tagsList, user))

  const result = await dataSource.transaction(async (manager) => {
    const bookmark = BookmarkEntity.create({
      title,
      description,
      link,
      state,
      privacy,
      user,
    })

    await manager.save(bookmark)

    if (tags.length > 0) {
      bookmark.bookmarkTags = await manager.save(
        tags.map((tag, index) =>
          BookmarkTagEntity.create({ bookmark, tag, order: index })
        )
      )
    }

    return bookmark
  })

  return result
}
