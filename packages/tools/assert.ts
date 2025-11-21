export function assert<I>(
  input: I,
  message = 'Assertion failed'
): asserts input {
  if (input != null) {
    return
  }

  throw new Error(message)
}

export function ensure<I>(input: I | null | undefined, message?: string): I {
  assert(input, message)
  return input
}
