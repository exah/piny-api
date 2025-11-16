import './app/data-source'
import { main } from './app/main'
import { getServerHostPort, getServerURL } from './app/utils/get-server-config'

const { host, port } = getServerHostPort()
main.listen({ host, port })

console.log(`
  🌲 Welcome to Piny
  Server is open at ${getServerURL({ host, port })}
`)
