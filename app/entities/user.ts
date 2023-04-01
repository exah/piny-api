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

import { AuthType } from '../constants/auth'
import { Bookmark } from './bookmark'
import { Session } from './session'
import { Tag } from './tag'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', unique: true })
  name: string

  @Column({ type: 'text', unique: true })
  email: string

  @Column({ type: 'simple-enum', enum: AuthType, default: AuthType.pass })
  auth: AuthType

  @Column({ type: 'text' })
  pass: string

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[]

  @ManyToMany(() => Tag, (tag) => tag.users)
  tags: Tag[]

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
