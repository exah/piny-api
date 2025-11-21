import { Context, Next } from 'koa'
import crypto from 'crypto'
import { ResponseError } from './response'

export async function handleError(context: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    const id = crypto.randomUUID()

    if (error instanceof Error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(
          Object.assign(error, {
            id,
            url: context.request.url,
          })
        )
      }

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
