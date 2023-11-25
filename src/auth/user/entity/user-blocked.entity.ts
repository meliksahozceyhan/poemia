import { BaseEntity } from 'src/sdk/entity/base.entity'
import { User } from './user.entity'
import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
@Unique(['blockedBy', 'blocks'])
export class UserBlocked extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'blocked_by' })
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ type: User })
  blockedBy: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocks_id' })
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ type: User })
  blocks: User
}
