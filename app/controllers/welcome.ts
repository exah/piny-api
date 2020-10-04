import { RouterContext } from '../types'

export const WelcomeController = {
  get({ response }: RouterContext) {
    response.body = {
      message: `🌲 Welcome to Piny`,
    }
  },
}
