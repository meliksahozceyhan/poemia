import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'

@Entity()
export class UserView extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false, lazy: true })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'viewer_id' })
  @Exclude({ toPlainOnly: true })
  viewer: User

  @Column({ default: true })
  isSecret: boolean
}
