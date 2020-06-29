import '../connect.ts'

import { Application } from 'https://deno.land/x/oak/mod.ts'
import { router } from './router.ts'

const hostname = Deno.env.get('HOST') || '0.0.0.0'
const port = Number(Deno.env.get('PORT')) || 3000

export const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())
app.listen({ hostname, port })

console.log(`
  Welcome to 'piny-api' 👋
  Server is open at http://${hostname}:${port}/
`)
