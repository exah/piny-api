import type * as v from 'valibot'
import { LinkIdSchema, LinkSchema } from './schemas'

export type LinkId = v.InferOutput<typeof LinkIdSchema>
export type Link = v.InferOutput<typeof LinkSchema>
