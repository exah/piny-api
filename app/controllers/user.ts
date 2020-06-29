import { RouterContext } from 'https://deno.land/x/oak/mod.ts'
import { User } from '../entities/User.ts'

export async function getUser({
  response,
  params,
}: RouterContext<{ user: string }>) {
  try {
    const user = await User.findOne({ name: params.user })

    response.body = user
  } catch (error) {
    response.status = 500
    response.body = { message: error.message }
  }
}
