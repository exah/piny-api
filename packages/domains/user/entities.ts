import {
  Entity,
  BaseEntity,
  OneToMany,
  ManyToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { AuthType } from '@piny/session/constants'
import { SessionEntity } from '@piny/session/entities'
import { BookmarkEntity } from '@piny/bookmark/entities'
import { TagEntity } from '@piny/tag/entities'
import type { UserId } from './types'

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UserId

  @Column({ type: 'text', unique: true })
  name: string

  @Column({ type: 'text', unique: true })
  email: string

  @Column({
    type: 'simple-enum',
    enum: Object.keys(AuthType),
    default: AuthType.pass,
  })
  auth: AuthType

  @Column({ type: 'text' })
  pass: string

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[]

  @ManyToMany(() => TagEntity, (tag) => tag.users)
  tags: TagEntity[]

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
  bookmarks: BookmarkEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
