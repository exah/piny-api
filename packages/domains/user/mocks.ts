import { faker } from '@faker-js/faker'
import { User } from './entities'

interface UserMock extends Partial<Pick<User, 'name' | 'pass' | 'email'>> {}

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
