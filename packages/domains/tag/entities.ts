import {
  Entity,
  BaseEntity,
  JoinTable,
  ManyToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '@piny/user/entities'
import { Bookmark } from '@piny/bookmark/entities'

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', unique: true })
  name: string

  @ManyToMany(() => User, (user) => user.tags)
  @JoinTable()
  users: User[]

  @ManyToMany(() => Bookmark, (bookmark) => bookmark.tags)
  @JoinTable()
  bookmarks: Bookmark[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
