import { RouterContext } from 'https://deno.land/x/oak/mod.ts'

export async function getWelcome({ response }: RouterContext) {
  response.body = {
    message: `Welcome to 'piny-api' 👋`,
  }
}
