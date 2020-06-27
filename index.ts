import { app } from './app.ts'

const hostname = Deno.env.get('HOST') ?? '0.0.0.0'
const port = Number(Deno.env.get('PORT')) ?? 3000

console.log(`
  Welcome to 'piny-api' 👋
  Server is open at http://${hostname}:${port}/
`)

app.listen({ hostname, port })
