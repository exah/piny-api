import '../connect.ts'
import { User } from '../app/entities/user.ts'
import { encrypt } from '../app/utils.ts'

console.log('Inserting a new user into the database...')

const user = new User()

user.name = 'exah'
user.email = 'r@exah.me'
user.pass = encrypt('1234')

await user.save()

console.log('Saved a new user with id: ' + user.id)
console.log('Loading users from the database...')

const users = await User.find()

console.log('Loaded users: ', users)
