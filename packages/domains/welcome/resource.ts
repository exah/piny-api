import type { RouterContext } from '@piny/api/types/router'
import type { MessageResponse } from '@piny/status/types'

export function get({ response }: RouterContext<MessageResponse>) {
  response.body = {
    message: `🌲 Welcome to Piny`,
  }
}
