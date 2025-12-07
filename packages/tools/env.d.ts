interface ObjectConstructor {
  keys<const T>(input: T): (keyof T)[]
}

type ValueOf<T> = T[keyof T]
