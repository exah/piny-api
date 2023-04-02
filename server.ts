import './app/data-source'
import { main } from './app/main'

const hostname = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT) || 3000

main.listen({ hostname, port })

console.log(`
  🌲 Welcome to Piny
  Server is open at http://${hostname}:${port}/
`)
