import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Allow, IsArray, IsEnum, IsObject, IsString } from 'class-validator'
import { UserReferenceDto } from 'src/auth/user/dto/user-reference-dto'
import { User } from 'src/auth/user/entity/user.entity'
import { Message } from 'src/chat/message/entity/message.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { LanguageNames } from 'src/util/languages'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Room extends BaseEntity {
  @JoinColumn({ name: 'created_by_id' })
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @ApiProperty({ type: User, nullable: false, required: false })
  @IsObject()
  createdBy: User

  @IsEnum(LanguageNames)
  @Column({ nullable: false, enum: LanguageNames })
  @ApiProperty({ enum: LanguageNames, nullable: true })
  language: LanguageNames

  @Column({ default: false })
  @ApiProperty()
  @Allow()
  isGeneralChat: boolean

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  roomName: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  roomImage: string

  @ManyToMany(() => User, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true })
  @JoinTable({ name: 'room_user' })
  @IsArray()
  @ApiProperty({ type: [UserReferenceDto] })
  participants: User[]

  @OneToMany(() => Message, 'room')
  @ApiHideProperty()
  messages: Message[]

  unreadMessageCount: number

  @Column({ type: 'timestamp with time zone', nullable: true, default: () => 'CURRENT_TIMESTAMP(6)' })
  @ApiProperty({ type: Date, nullable: true })
  lastMessageDate: Date

  lastMessage: Message
}
