import {
  Entity,
  BaseEntity,
  JoinTable,
  ManyToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'https://denolib.com/denolib/typeorm@v0.2.23-rc5/mod.ts'

import { User } from './user.ts'
import { Bookmark } from './bookmark.ts'

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
