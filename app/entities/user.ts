import {
  Entity,
  BaseEntity,
  OneToMany,
  ManyToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'https://denolib.com/denolib/typeorm@v0.2.23-rc5/mod.ts'

import { AuthType } from '../constants.ts'
import { Bookmark } from './bookmark.ts'
import { Session } from './session.ts'
import { Tag } from './tag.ts'
import { Link } from './link.ts'

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
