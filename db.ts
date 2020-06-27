import { Database } from 'https://deno.land/x/denodb/mod.ts'

export const db = new Database('sqlite3', {
  filepath: './piny.db',
})
