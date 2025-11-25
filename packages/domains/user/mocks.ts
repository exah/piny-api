import * as v from 'valibot'
import { faker } from '@faker-js/faker'
import { UserEntity } from './entities'
import { UserNameSchema, UserEmailSchema } from './schemas'

interface UserMock
  extends Partial<Pick<UserEntity, 'name' | 'pass' | 'email'>> {}

export function createUserMock({
  pass = faker.internet.password(),
  name = v.parse(UserNameSchema, faker.internet.username()),
  email = v.parse(UserEmailSchema, faker.internet.email()),
}: UserMock = {}) {
  const user = UserEntity.create({
    name,
    pass,
    email,
  })

  return user.save()
}
