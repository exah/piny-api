import { RouterContext } from 'https://deno.land/x/oak/mod.ts'

export const WelcomeController = {
  get({ response }: RouterContext) {
    response.body = {
      message: `🌲 Welcome to Piny`,
    }
  },
}
