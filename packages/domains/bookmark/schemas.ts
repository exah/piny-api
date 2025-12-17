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
  title: v.nullable(v.string(), ''),
  description: v.nullable(v.string(), ''),
  tags: v.array(TagSchema),
  state: v.enum(State),
  createdAt: v.date(),
  updatedAt: v.date(),
})

export const BookmarksListResponseSchema = v.array(BookmarkSchema)

export const BookmarkParamsSchema = v.object({
  bookmarkId: v.optional(BookmarkIdSchema),
})

export const CreateBookmarkPayloadSchema = v.object({
  url: v.pipe(v.string(), v.url()),
  privacy: v.enum(Privacy),
  title: v.nullish(v.string()),
  description: v.nullish(v.string()),
  tags: v.nullish(v.array(v.string())),
})

export const CreateBookmarkResponseSchema = v.object({
  id: BookmarkIdSchema,
  message: v.string(),
})

export const UpdateBookmarkPayloadSchema = v.object({
  url: v.nullish(v.pipe(v.string(), v.url())),
  privacy: v.nullish(v.enum(Privacy)),
  title: v.nullish(v.string()),
  description: v.nullish(v.string()),
  tags: v.nullish(v.array(v.string())),
})
