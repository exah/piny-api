import { createPath } from '../utils/create-path'

export const WELCOME = createPath('/')
export const SIGNUP = createPath('/signup')
export const LOGIN = createPath('/login')
export const LOGOUT = createPath('/logout')
export const BOOKMARKS = createPath('/bookmarks')
export const BOOKMARK_ID = createPath(BOOKMARKS, '/:id')
export const TAGS = createPath('/tags')
export const USER = createPath('/:user')
export const USER_BOOKMARKS = createPath(USER, BOOKMARKS)
export const USER_TAGS = createPath(USER, TAGS)
