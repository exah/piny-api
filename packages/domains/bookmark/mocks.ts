import { faker } from '@faker-js/faker'
import { createUserMock } from '@piny/user/mocks'
import { createLinkMock } from '@piny/link/mocks'
import { createTagsListMock } from '@piny/tag/mocks'
import { BookmarkEntity } from './entities'

interface BookmarkMock
  extends Partial<
    Pick<
      BookmarkEntity,
      'title' | 'description' | 'state' | 'privacy' | 'link' | 'user' | 'tags'
    >
  > {
  linkURL?: string
  tagsList?: string[]
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
  const user = mockedUser ?? (await createUserMock())
  const link = mockedLink ?? (await createLinkMock(linkURL))
  const tags = mockedTags ?? (await createTagsListMock(tagsList))

  const bookmark = BookmarkEntity.create({
    title,
    description,
    link,
    tags,
    state,
    privacy,
    user,
  })

  return bookmark.save()
}
