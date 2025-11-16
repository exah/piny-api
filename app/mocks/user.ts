import { User } from '../entities/user'
import { faker } from '@faker-js/faker'

interface UserMock extends Partial<User> {}

export function createUserMock({
  name = faker.internet.username(),
  pass = faker.internet.password(),
  email = faker.internet.email(),
}: UserMock = {}) {
  const user = User.create({
    name,
    pass,
    email,
  })

  return user.save()
}
