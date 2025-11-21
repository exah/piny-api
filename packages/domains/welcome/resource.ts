import type { RouterContext } from '@piny/backend/types/router'

export function get({ response }: RouterContext) {
  response.body = {
    message: `🌲 Welcome to Piny`,
  }
}
