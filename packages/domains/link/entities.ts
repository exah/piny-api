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

@Entity()
export class LinkEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', unique: true })
  url: string

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.link)
  bookmarks: BookmarkEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
