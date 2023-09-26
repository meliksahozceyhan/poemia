import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class UserLabel extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  @ApiProperty()
  label: string
}
