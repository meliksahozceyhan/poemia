import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { IsBoolean } from 'class-validator'

@Entity()
export class UserView extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'viewer_id' })
  viewer: User

  @Column({ default: true })
  @IsBoolean()
  isSecret: boolean
}
