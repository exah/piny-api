import { Router } from 'https://deno.land/x/oak/mod.ts'
import { AuthController } from './controllers/auth.ts'
import { WelcomeController } from './controllers/welcome.ts'
import { UserController } from './controllers/user.ts'
import { UserBookmarkController } from './controllers/user-bookmark.ts'

export const router = new Router()

router
  .get('/', WelcomeController.get)
  .post('/login', AuthController.login)
  .get('/logout', AuthController.logout)
  .get('/:user', AuthController.verify, UserController.get)
  .get('/:user/bookmarks', AuthController.verify, UserBookmarkController.get)
  .post('/:user/bookmarks', AuthController.verify, UserBookmarkController.add)
