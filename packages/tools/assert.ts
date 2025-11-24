export function assert<I>(
  input: I,
  error = new Error('Assertion failed')
): asserts input {
  if (input != null) {
    return
  }

  throw error
}

export function ensure<I>(input: I | null | undefined, error?: Error): I {
  assert(input, error)
  return input
}
