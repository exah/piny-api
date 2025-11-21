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

import { User } from '@piny/user/entity'
import { Link } from '@piny/link/entity'
import { Tag } from '@piny/tag/entity'

import { Privacy, State } from './constants'

@Entity()
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', nullable: true, default: null })
  title: string | null

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null

  @Column({ type: 'simple-enum', enum: Object.keys(State) })
  state: State

  @Column({ type: 'simple-enum', enum: Object.keys(Privacy) })
  privacy: Privacy

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
