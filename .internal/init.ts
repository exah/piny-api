import '../connect.ts'
import { User } from '../app/entities/user.ts'
import { hash } from '../app/utils.ts'

console.log('Inserting a new user into the database...')

const user = User.create({
  name: 'exah',
  email: 'r@exah.me',
  pass: hash('1234'),
  token: [],
})

await user.save()

console.log('Saved a new user with id: ' + user.id)
console.log('Loading users from the database...')

const users = await User.find()

console.log('Loaded users: ', users)
