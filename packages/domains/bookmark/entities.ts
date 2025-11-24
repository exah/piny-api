import {
  Entity,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { UserEntity } from '@piny/user/entities'
import { LinkEntity } from '@piny/link/entities'
import { TagEntity } from '@piny/tag/entities'

import { Privacy, State } from './constants'
import type { BookmarkId } from './types'

@Entity()
export class BookmarkEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: BookmarkId

  @Column({ type: 'text', nullable: true, default: null })
  title: string | null

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null

  @Column({ type: 'simple-enum', enum: Object.keys(State) })
  state: State

  @Column({ type: 'simple-enum', enum: Object.keys(Privacy) })
  privacy: Privacy

  @ManyToOne(() => UserEntity, (user) => user.bookmarks)
  user: UserEntity

  @ManyToMany(() => TagEntity, (tag) => tag.bookmarks)
  tags: TagEntity[]

  @ManyToOne(() => LinkEntity, (link) => link.bookmarks)
  link: LinkEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
