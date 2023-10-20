import { Exclude } from 'class-transformer'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class UserBadge extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false, lazy: true })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  //TODO: The details will be clear when competition feature finished.
  @Column({ nullable: true })
  @ApiProperty({ description: 'Field to remove. After Competition details finished this field will filled with needed details.', nullable: true })
  toBeChanged: string
}
