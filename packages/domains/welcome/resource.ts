import type { RouterContext } from '@piny/api/types/router'

export function get({ response }: RouterContext) {
  response.body = {
    message: `🌲 Welcome to Piny`,
  }
}
