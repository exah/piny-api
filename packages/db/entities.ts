import { BookmarkEntity, BookmarkTagEntity } from '@piny/bookmark/entities'
import { LinkEntity } from '@piny/link/entities'
import { SessionEntity } from '@piny/session/entities'
import { TagEntity } from '@piny/tag/entities'
import { UserEntity } from '@piny/user/entities'

export const ENTITIES_REGISTRY = [
  BookmarkEntity,
  BookmarkTagEntity,
  LinkEntity,
  SessionEntity,
  TagEntity,
  UserEntity,
]
