import {
  Entity,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'https://denolib.com/denolib/typeorm@v0.2.23-rc5/mod.ts'

import { BookmarkPrivacy, BookmarkState } from '../constants.ts'
import { User } from './user.ts'
import { Link } from './link.ts'
import { Tag } from './tag.ts'

@Entity()
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', nullable: true, default: null })
  title: string | null

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null

  @Column({ type: 'simple-enum', enum: BookmarkState })
  state: BookmarkState

  @Column({ type: 'simple-enum', enum: BookmarkPrivacy })
  privacy: BookmarkPrivacy

  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User

  @ManyToMany(() => Tag, (tag) => tag.bookmarks)
  tags: Tag[]

  @ManyToOne(() => Link, (link) => link.bookmarks)
  link: Link

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
