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

import { UserEntity } from '@piny/user/entities'
import { BookmarkEntity } from '@piny/bookmark/entities'
import type { TagId, TagName } from './types'

@Entity()
class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: TagId

  @Column({ type: 'text', unique: true })
  name: TagName

  @ManyToMany(() => UserEntity, (user) => user.tags)
  @JoinTable()
  users: UserEntity[]

  @ManyToMany(() => BookmarkEntity, (bookmark) => bookmark.tags)
  @JoinTable()
  bookmarks: BookmarkEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export { Tag as TagEntity }
