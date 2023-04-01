import { RouterContext } from '../types/router'

export function message({ response }: RouterContext) {
  response.body = {
    message: `🌲 Welcome to Piny`,
  }
}
