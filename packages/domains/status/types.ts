import type * as v from 'valibot'
import type {
  ErrorIdSchema,
  ErrorCodeSchema,
  ErrorResponseSchema,
  MessageResponseSchema,
} from './schemas'
import type {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotAcceptableError,
  ConflictError,
  InternalServerError,
  ParsingError,
} from './errors'

export type RegisteredResponseError =
  | BadRequestError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError
  | NotAcceptableError
  | ConflictError
  | InternalServerError
  | ParsingError

export type ErrorId = v.InferOutput<typeof ErrorIdSchema>
export type ErrorCode = v.InferOutput<typeof ErrorCodeSchema>
export type ErrorResponse = v.InferOutput<typeof ErrorResponseSchema>
export type MessageResponse = v.InferOutput<typeof MessageResponseSchema>

export type Schema<
  Input = unknown,
  Output = unknown,
  Issue extends v.BaseIssue<Input> = v.BaseIssue<Input>
> = v.BaseSchema<Input, Output, Issue> | v.BaseSchemaAsync<Input, Output, Issue>

export type UnknownSchema<Issue extends v.GenericIssue = v.GenericIssue> =
  Schema<unknown, unknown, Issue>

export type UnknownIssue = v.GenericIssue<unknown>
