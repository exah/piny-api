import * as v from 'valibot'
import { LinkSchema } from '@piny/link/schemas'
import { TagSchema } from '@piny/tag/schemas'
import { Privacy, State } from './constants'

export const BookmarkIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.brand('BookmarkId')
)

export const BookmarkSchema = v.object({
  id: BookmarkIdSchema,
  link: LinkSchema,
  privacy: v.enum(Privacy),
  title: v.nullable(v.string()),
  description: v.nullable(v.string()),
  tags: v.nullable(v.array(TagSchema)),
  state: v.nullable(v.enum(State)),
  createdAt: v.date(),
})

export const BookmarksListResponseSchema = v.array(BookmarkSchema)

export const BookmarkParamsSchema = v.object({
  bookmarkId: v.optional(BookmarkIdSchema),
})

export const CreateBookmarkPayloadSchema = v.object({
  url: v.pipe(v.string(), v.url()),
  privacy: v.enum(Privacy),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  state: v.optional(v.enum(State)),
})

export const UpdateBookmarkPayloadSchema = v.partial(
  CreateBookmarkPayloadSchema
)
