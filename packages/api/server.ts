import '@piny/db/init'
import { getServerHostPort, getServerURL } from './config'
import { app } from './app'

const { host, port } = getServerHostPort()
export const server = app.listen({ host, port })

console.log(`
  🌲 Welcome to Piny
  Server is open at ${getServerURL({ host, port })}
`)
