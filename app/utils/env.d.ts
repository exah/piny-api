interface ObjectConstructor {
  keys<const T>(input: T): (keyof T)[]
}
