import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import * as v from 'valibot'
import { Time } from '@piny/tools/constants'
import { SessionTokenSchema } from './schemas'
import { ensure } from '@piny/tools/assert'
import type { SessionToken } from './types'

const key = ensure(process.env.KEY, new Error(`Please, add 'KEY' env variable`))

export const hash = (name: string, pass: string) =>
  crypto
    .createHmac('sha256', key + name)
    .update(pass)
    .digest('hex')

export const createToken = (iss: string, exp: number) =>
  new Promise<SessionToken>((resolve, reject) =>
    jwt.sign(
      { iss, iat: Date.now(), exp },
      key,
      { algorithm: 'HS256' },
      (error, result) => {
        if (error) {
          return reject(error)
        }

        if (result === undefined) {
          return reject(new TypeError('sign result is undefined'))
        } else {
          return resolve(v.parseAsync(SessionTokenSchema, result))
        }
      }
    )
  )

export const validateToken = (input: string) =>
  new Promise<boolean>((resolve, reject) =>
    jwt.verify(input, key, { algorithms: ['HS256'] }, (error, result) => {
      if (error) {
        return reject(error)
      }

      return resolve(result !== undefined)
    })
  )

export async function getPrefixedToken(
  input: string | null,
  prefix = 'Bearer '
) {
  if (input?.startsWith(prefix)) {
    return v.parseAsync(SessionTokenSchema, input.slice(prefix.length))
  }

  return null
}

export const getTokenExpiration = (now = Date.now()) => now + 4 * Time.WEEK
