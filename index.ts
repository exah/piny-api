import { createConnection } from 'typeorm'
import { app } from './app'

const hostname = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT) || 3000
const message = `
  🌲 Welcome to Piny
  Server is open at http://${hostname}:${port}/
`

createConnection().then(() => {
  app.listen({ hostname, port })
  console.log(message)
})
