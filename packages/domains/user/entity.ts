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

import { Bookmark } from '@piny/bookmark/entity'
import { AuthType } from '@piny/session/constants'
import { Session } from '@piny/session/entity'
import { Tag } from '@piny/tag/entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

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
