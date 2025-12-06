import {
  Entity,
  BaseEntity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { UserEntity } from '@piny/user/entities'
import { BookmarkTagEntity } from '@piny/bookmark/entities'
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

  @OneToMany(() => BookmarkTagEntity, (bookmarkTag) => bookmarkTag.tag)
  bookmarkTags: BookmarkTagEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export { Tag as TagEntity }
