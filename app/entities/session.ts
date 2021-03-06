import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from './user'

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', unique: true, primary: true })
  token: string

  @Column({ type: 'integer' })
  expiration: number

  @ManyToOne(() => User, (user) => user.sessions)
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
