import './connect.ts'
import { app } from './app/mod.ts'

const hostname = Deno.env.get('HOST') || '0.0.0.0'
const port = Number(Deno.env.get('PORT')) || 3000

app.listen({ hostname, port })

console.log(`
  Welcome to 'piny-api' 👋
  Server is open at http://${hostname}:${port}/
`)
