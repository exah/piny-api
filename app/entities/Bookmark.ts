import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'https://denolib.com/denolib/typeorm@v0.2.23-rc5/mod.ts'

import { PrivacyType } from '../constants.ts'
import { User } from './User.ts'
import { Link } from './Link.ts'

@Entity()
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  title: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ type: 'simple-enum', enum: PrivacyType })
  privacy: PrivacyType

  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User

  @ManyToOne(() => Link, (link) => link.bookmarks)
  link: Link
}
