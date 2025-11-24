import type * as v from 'valibot'
import type { TagIdSchema, TagSchema, TagsListResponseSchema } from './schemas'

export type TagId = v.InferOutput<typeof TagIdSchema>
export type Tag = Strict<v.InferOutput<typeof TagSchema>>
export type TagsListResponse = v.InferOutput<typeof TagsListResponseSchema>
