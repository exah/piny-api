import {
  Entity,
  BaseEntity,
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { BookmarkEntity } from '@piny/bookmark/entities'
import type { LinkId } from './types'

@Entity()
export class LinkEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: LinkId

  @Column({ type: 'text', unique: true })
  url: string

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.link)
  bookmarks: BookmarkEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
