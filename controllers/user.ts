import { RouterContext } from 'https://deno.land/x/oak/mod.ts'
import { UserModel } from '../models.ts'

export async function getUser({
  response,
  params,
}: RouterContext<{ user: string }>) {
  try {
    const [user] = await UserModel.where('name', params.user).get()

    delete user.auth
    delete user.pass

    response.body = user
  } catch (error) {
    response.status = 500
    response.body = { message: error.message }
  }
}
