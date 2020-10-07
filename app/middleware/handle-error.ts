import { v4 as UUID } from 'uuid'
import { Context, Next } from 'koa'
import { ResponseError } from '../utils/errors'

export async function handleError(context: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    const id = UUID()
    console.error(Object.assign(error, { id }))

    if (error instanceof ResponseError) {
      context.status = error.status
      context.body = { id, message: error.description || error.message }
    } else {
      context.status = 500
      context.body = { id, message: '😭 Something went wrong' }
    }
  }
}
