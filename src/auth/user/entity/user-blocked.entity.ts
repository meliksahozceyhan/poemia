import { BaseEntity } from 'src/sdk/entity/base.entity'
import { User } from './user.entity'
import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
@Unique(['blockedBy', 'blocks'])
export class UserBlocked extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'blocked_by' })
  @ApiProperty({ type: User })
  blockedBy: User

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'blocks_id' })
  @ApiProperty({ type: User })
  blocks: User
}
