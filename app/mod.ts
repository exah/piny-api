import { Application } from 'https://deno.land/x/oak/mod.ts'
import { router } from './router.ts'

export const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())
