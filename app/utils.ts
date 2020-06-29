import { HmacSha256 } from 'https://deno.land/std@v0.56.0/hash/sha256.ts'
import { makeJwt } from 'https://deno.land/x/djwt/create.ts'
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts'

const key = Deno.env.get('KEY')

if (typeof key !== 'string') {
  throw new Error(`Please, add 'KEY' env variable`)
}

export const hash = (input: string) =>
  new HmacSha256(key).update(input).toString()

export const jwt = (user: string, ttl: number = 1000 * 60 * 5) =>
  makeJwt({
    key,
    header: { alg: 'HS256' },
    payload: { iss: user, iat: Date.now(), exp: Date.now() + ttl },
  })

export const validate = (jwt: string | null) =>
  jwt == null
    ? Promise.resolve(false)
    : validateJwt(jwt, key).then((result) => result.isValid)
