import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsString } from 'class-validator'
import { User } from 'src/auth/user/entity/user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { MessageView } from './message-view.entity'
import { Room } from 'src/chat/room/entity/room.entity'

@Entity()
export class Message extends BaseEntity {
  @ManyToOne(() => Room, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'room_id' })
  @ApiProperty({ type: Room, nullable: false, required: true })
  @IsObject()
  room: Room

  @Column({ nullable: false })
  @ApiProperty({ nullable: false, required: true })
  @IsString()
  content: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  imagePath: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  voicePath: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  videoPath: string

  @JoinColumn({ name: 'sent_by_id' })
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @ApiProperty({ type: User, nullable: false, required: false })
  @IsObject()
  sentBy: User

  @OneToMany(() => MessageView, (messageView) => messageView.message, { eager: true })
  views: MessageView[]
}
