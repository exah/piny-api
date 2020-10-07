import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const key = process.env.KEY

if (typeof key !== 'string') {
  throw new Error(`Please, add 'KEY' env variable`)
}

export const hash = (name: string, pass: string) =>
  crypto
    .createHmac('sha256', key + name)
    .update(pass)
    .digest('hex')

export const createToken = (iss: string, exp: number) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      { iss, iat: Date.now(), exp },
      key,
      { algorithm: 'HS256' },
      (error, result) => (error ? reject(error) : resolve(result))
    )
  )

export const validateToken = (input: string) =>
  new Promise<string | object>((resolve, reject) =>
    jwt.verify(input, key, { algorithms: ['HS256'] }, (error, result) =>
      error ? reject(error) : resolve(result)
    )
  )
