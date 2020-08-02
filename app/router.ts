import { Router } from 'https://deno.land/x/oak@v5.3.1/mod.ts'
import { AuthController } from './controllers/auth.ts'
import { WelcomeController } from './controllers/welcome.ts'
import { UserController } from './controllers/user.ts'
import { BookmarkController } from './controllers/bookmark.ts'
import { UserTagController } from './controllers/user-tag.ts'

export const router = new Router()

router
  .get('/', WelcomeController.get)
  .post('/signup', AuthController.signup)
  .post('/login', AuthController.login)
  .get('/logout', AuthController.logout)
  .get('/bookmarks', AuthController.verify, BookmarkController.get)
  .post('/bookmarks', AuthController.verify, BookmarkController.add)
  .patch('/bookmarks/:id', AuthController.verify, BookmarkController.edit)
  .delete('/bookmarks/:id', AuthController.verify, BookmarkController.remove)
  .get('/:user', AuthController.verify, UserController.get)
  .get('/:user/bookmarks', AuthController.session, BookmarkController.get)
  .get('/:user/tags', AuthController.verify, UserTagController.get)
