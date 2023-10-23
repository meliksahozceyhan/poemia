import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsObject, IsString } from 'class-validator'

@Entity()
export class UserNameChange extends BaseEntity {
  @Column()
  @ApiProperty()
  @IsString()
  before: string

  @Column()
  @ApiProperty()
  @IsString()
  after: string

  @Column({ type: 'timestamp with time zone' })
  @ApiProperty()
  @IsDate()
  expiresAt: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ type: User })
  @IsObject()
  user: User
}
