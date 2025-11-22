import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '@piny/user/entities'
import type { SessionId, SessionToken } from './types'

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: SessionId

  @Column({ type: 'text', unique: true, primary: true })
  token: SessionToken

  @Column({ type: 'integer' })
  expiration: number

  @ManyToOne(() => User, (user) => user.sessions)
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
