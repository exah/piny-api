import { Body } from 'https://deno.land/x/oak/mod.ts'
import { HmacSha256 } from 'https://deno.land/std@v0.56.0/hash/sha256.ts'
import { makeJwt } from 'https://deno.land/x/djwt/create.ts'
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts'

const key = Deno.env.get('KEY')

if (typeof key !== 'string') {
  throw new Error(`Please, add 'KEY' env variable`)
}

export const hash = (name: string, pass: string) =>
  new HmacSha256(key + name).update(pass).toString()

export const jwt = (iss: string, exp: number) =>
  makeJwt({
    key,
    header: { alg: 'HS256' },
    payload: { iss, iat: Date.now(), exp },
  })

export const validate = (jwt: string) =>
  validateJwt(jwt, key).then((result) => result.isValid)

interface BodyJson<V> {
  type: 'json'
  value: V
}

export function assertPayload<V>(
  input: Body,
  check: (value: V) => boolean = () => true,
  message: string = 'request body should be a valid JSON'
): asserts input is BodyJson<V> {
  if (input.type === 'json' && check(input.value)) return

  throw new Error(message)
}
