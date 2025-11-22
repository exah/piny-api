import { ResponseError } from './errors'
import type { ResponseErrorVariant } from './errors'

export const isResponseError = (
  error: unknown
): error is ResponseErrorVariant => error instanceof ResponseError
