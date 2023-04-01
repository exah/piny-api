import { app } from './app'
import './app/data-source'

const hostname = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT) || 3000

app.listen({ hostname, port })

console.log(`
  🌲 Welcome to Piny
  Server is open at http://${hostname}:${port}/
`)
