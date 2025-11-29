import type * as v from 'valibot'
import type {
  TagSchema,
  TagIdSchema,
  TagNameSchema,
  TagsListResponseSchema,
} from './schemas'

export type Tag = Strict<v.InferOutput<typeof TagSchema>>
export type TagId = v.InferOutput<typeof TagIdSchema>
export type TagName = v.InferOutput<typeof TagNameSchema>
export type TagsListResponse = v.InferOutput<typeof TagsListResponseSchema>
