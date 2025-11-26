import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { UserEntity } from '@piny/user/entities'
import type { SessionId, SessionToken } from './types'

@Entity()
class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: SessionId

  @Column({ type: 'text', unique: true, primary: true })
  token: SessionToken

  @Column({ type: 'integer' })
  expiration: number

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export { Session as SessionEntity }
