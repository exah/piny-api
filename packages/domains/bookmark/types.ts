import type * as v from 'valibot'
import type {
  BookmarkIdSchema,
  BookmarkParamsSchema,
  CreateBookmarkPayloadSchema,
  UpdateBookmarkPayloadSchema,
  BookmarksListResponseSchema,
  BookmarkSchema,
} from './schemas'

export type Bookmark = v.InferOutput<typeof BookmarkSchema>
export type BookmarkId = v.InferOutput<typeof BookmarkIdSchema>
export type BookmarkParams = v.InferOutput<typeof BookmarkParamsSchema>

export type BookmarksListResponse = v.InferOutput<
  typeof BookmarksListResponseSchema
>

export type CreateBookmarkPayload = v.InferOutput<
  typeof CreateBookmarkPayloadSchema
>

export type UpdateBookmarkPayload = v.InferOutput<
  typeof UpdateBookmarkPayloadSchema
>
