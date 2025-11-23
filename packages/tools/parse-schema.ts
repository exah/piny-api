import * as v from 'valibot'

export function createSchemaParser<
  const Schema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>(schema: Schema) {
  const parser = v.parserAsync(schema)
  return (input: v.InferInput<Schema>) => parser(input)
}

export function parseSchema<
  const Schema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>(schema: Schema, input: v.InferInput<Schema>) {
  return v.parseAsync(schema, input)
}
