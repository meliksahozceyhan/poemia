import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'
import { BaseEntity } from 'src/sdk/entity/base-entity'

@Entity()
export class UserLabel extends BaseEntity {
  @ManyToOne(() => User, { lazy: true, eager: false })
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>

  @Column()
  label: string
}
