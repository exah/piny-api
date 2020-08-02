import { RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts'

export const WelcomeController = {
  get({ response }: RouterContext) {
    response.body = {
      message: `🌲 Welcome to Piny`,
    }
  },
}
