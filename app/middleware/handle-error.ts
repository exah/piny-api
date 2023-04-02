import { Context, Next } from 'koa'
import crypto from 'crypto'
import { ResponseError } from '../utils/errors'

export async function handleError(context: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    const id = crypto.randomUUID()

    if (error instanceof Error) {
      console.error(Object.assign(error, { id }))

      if (error instanceof ResponseError) {
        context.status = error.status
        context.body = { id, message: error.description || error.message }
        return
      }
    }

    context.status = 500
    context.body = { id, message: '😭 Something went wrong' }
  }
}
