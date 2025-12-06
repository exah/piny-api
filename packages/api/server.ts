import '@piny/db/init'
import dedent from 'dedent'
import { logger } from '@piny/tools/logger'
import { getServerHostPort, getServerURL } from './config'
import { app } from './app'

const { host, port } = getServerHostPort()
export const server = app.listen({ host, port })

logger.info(dedent`
  🌲 Welcome to Piny
  Server is open at ${getServerURL({ host, port })}
`)
