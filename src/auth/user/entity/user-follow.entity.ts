import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
@Unique(['user', 'follower'])
export class UserFollow extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: true })
  user: User

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'follower_id' })
  @ApiProperty({ type: User, nullable: true })
  follower: User

  @Column({})
  @IsBoolean()
  isActive: boolean
}
