import {
  Entity,
  BaseEntity,
  ManyToOne,
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

import { UserEntity } from '@piny/user/entities'
import type { SessionId, SessionToken } from './types'

@Entity()
class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: SessionId

  @Column({ type: 'text', unique: true, primary: true })
  token: SessionToken

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity

  @Column({ type: 'text', nullable: true })
  deviceId: string

  @Column({ type: 'text', nullable: true })
  deviceDescription: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ type: 'datetime' })
  expiresAt: Date

  @VersionColumn()
  version: number

  @ManyToOne(() => Session, (session) => session.previousSessions)
  succeedingSession: Session | null

  @OneToMany(() => Session, (session) => session.succeedingSession)
  previousSessions: Session[]
}

export { Session as SessionEntity }
