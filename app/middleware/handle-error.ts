import { Context, Next } from 'koa'
import { ResponseError } from '../errors'

export async function handleError(context: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error(error)

    if (error instanceof ResponseError) {
      context.status = error.status
      context.body = { message: error.description || error.message }
    } else {
      context.status = 500
      context.body = { message: '😭 Something went wrong' }
    }
  }
}
