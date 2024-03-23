import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Message } from '../entity/message.entity'
import { UserReferenceDto } from 'src/auth/user/dto/user-reference-dto'
import { IsObject } from 'class-validator'
import { RoomReferenceDto } from 'src/chat/room/dto/room-reference.dto'

export class MessageDto extends PartialType(OmitType(Message, ['id', 'createdAt', 'updatedAt', 'sentBy', 'room'])) {
  @ApiProperty({ type: UserReferenceDto })
  @IsObject()
  sentBy: UserReferenceDto

  @ApiProperty({ type: RoomReferenceDto })
  @IsObject()
  room: RoomReferenceDto
}
