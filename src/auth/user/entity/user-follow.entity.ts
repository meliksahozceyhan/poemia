import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { IsBoolean } from 'class-validator'

@Entity()
@Unique(['user', 'follower'])
export class UserFollow extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false, lazy: true })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User

  @Column({})
  @IsBoolean()
  isActive: boolean
}
