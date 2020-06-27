import { HmacSha256 } from 'https://deno.land/std/hash/sha256.ts'

const key = Deno.env.get('KEY')

if (typeof key !== 'string') {
  throw new Error(`Please, add 'KEY' env variable`)
}

export const sha256 = new HmacSha256(key)
export const encrypt = (input: string) => sha256.update(input).toString()
