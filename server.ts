import Koa from 'koa'
import { handleError } from './app/middleware/handle-error'
import { router } from './app/router'
import './app/data-source'

const hostname = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT) || 3000
const app = new Koa()

app.use(handleError)
app.use(router.routes())
app.use(router.allowedMethods())

app.listen({ hostname, port })

console.log(`
  🌲 Welcome to Piny
  Server is open at http://${hostname}:${port}/
`)
