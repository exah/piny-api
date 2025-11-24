interface ObjectConstructor {
  keys<const T>(input: T): (keyof T)[]
}

type ValueOf<T> = T[keyof T]

type Impossible<K extends PropertyKey> = {
  [P in K]: never
}

type Strict<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>
