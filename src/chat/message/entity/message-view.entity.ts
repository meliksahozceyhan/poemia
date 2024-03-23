import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Message } from './message.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/auth/user/entity/user.entity'

@Entity()
export class MessageView extends BaseEntity {
  @ManyToOne(() => Message, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'message_id' })
  @ApiProperty({ type: Message, nullable: false, required: true })
  message: Message

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  user: User

  @Column({ default: false, nullable: false })
  @ApiProperty({ type: Boolean, nullable: false, required: false, default: false })
  isRead: boolean
}
