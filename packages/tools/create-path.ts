type Path<I> = I extends [infer U, ...infer Rest]
  ? U extends string
    ? Path<Rest> extends never
      ? `${U}`
      : `${U}${Path<Rest>}`
    : never
  : never

export const createPath = <I extends string[]>(...input: I) =>
  input.join('') as Path<I>
