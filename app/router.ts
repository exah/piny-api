import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getWelcome } from './controllers/welcome.ts'
import { getUser } from './controllers/user.ts'
import { getBookmarks, addBookmark } from './controllers/bookmark.ts'

export const router = new Router()

router
  .get('/', getWelcome)
  .get('/:user', getUser)
  .get('/:user/bookmarks', getBookmarks)
  .post('/:user/bookmarks', addBookmark)
