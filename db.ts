import { Database } from 'https://deno.land/x/denodb/mod.ts'
import { UserModel, LinkModel, BookmarkModel } from './models.ts'

export const db = new Database('sqlite3', {
  filepath: './piny.db',
})

db.link([UserModel, LinkModel, BookmarkModel])
