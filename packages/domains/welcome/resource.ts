import type { RouterContext } from '@piny/api/types/router'
import type { MessageResponse } from '@piny/status/types'

export function get({ reply }: RouterContext<MessageResponse>) {
  reply(200, `🌲 Welcome to Piny`)
}
