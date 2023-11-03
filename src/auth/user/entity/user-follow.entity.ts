import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { IsBoolean } from 'class-validator'

@Entity()
@Unique(['user', 'follower'])
export class UserFollow extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'follower_id' })
  follower: User

  @Column({})
  @IsBoolean()
  isActive: boolean
}
