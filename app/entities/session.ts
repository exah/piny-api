import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
} from 'https://denolib.com/denolib/typeorm@v0.2.23-rc5/mod.ts'

import { User } from './user.ts'

@Entity()
export class Session extends BaseEntity {
  @Column({ type: 'text', unique: true, primary: true })
  token: string

  @Column({ type: 'integer' })
  expiration: number

  @ManyToOne(() => User, (user) => user.sessions)
  user: User
}
