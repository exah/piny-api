import { RouterContext } from '../types/router'

export function get({ response }: RouterContext) {
  response.body = {
    message: `🌲 Welcome to Piny`,
  }
}
