import { Router } from 'https://deno.land/x/oak/mod.ts'
import { WelcomeController } from './controllers/welcome.ts'
import { UserController } from './controllers/user.ts'
import { UserBookmarkController } from './controllers/user-bookmark.ts'

export const router = new Router()

router
  .get('/', WelcomeController.get)
  .get('/:user', UserController.get)
  .get('/:user/bookmarks', UserBookmarkController.get)
  .post('/:user/bookmarks', UserBookmarkController.add)
