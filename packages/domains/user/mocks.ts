import { faker } from '@faker-js/faker'
import { UserEntity } from './entities'

interface UserMock
  extends Partial<Pick<UserEntity, 'name' | 'pass' | 'email'>> {}

export function createUserMock({
  name = faker.internet.username(),
  pass = faker.internet.password(),
  email = faker.internet.email(),
}: UserMock = {}) {
  const user = UserEntity.create({
    name,
    pass,
    email,
  })

  return user.save()
}
