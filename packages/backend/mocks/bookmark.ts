import { faker } from '@faker-js/faker'
import { Bookmark } from '@piny/bookmark/entity'
import { createUserMock } from './user'
import { createLinkMock } from './link'
import { createTagsListMock } from './tag'

interface BookmarkMock
  extends Partial<
    Pick<
      Bookmark,
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

  const bookmark = Bookmark.create({
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
