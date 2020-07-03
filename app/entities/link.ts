import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'https://denolib.com/denolib/typeorm@v0.2.23-rc5/mod.ts'

import { Bookmark } from './bookmark.ts'

@Entity()
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', unique: true })
  url: string

  @OneToMany(() => Bookmark, (bookmark) => bookmark.link)
  bookmarks: Bookmark[]
}