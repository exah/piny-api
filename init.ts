import { generate } from 'https://deno.land/std/uuid/v4.ts'
import { encrypt } from './utils.ts'
import { UserModel } from './models.ts'
import { db } from './db.ts'

await db.sync({ drop: true })

await UserModel.create({
  id: generate(),
  name: 'exah',
  email: 'r@exah.me',
  pass: encrypt('1234'),
})
