import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Room } from '../entity/room.entity'
import { UserReferenceDto } from 'src/auth/user/dto/user-reference-dto'
import { IsArray } from 'class-validator'

export class RoomDTO extends PartialType(OmitType(Room, ['id', 'createdAt', 'updatedAt', 'isGeneralChat', 'participants'])) {
  @ApiProperty({ type: [UserReferenceDto] })
  @IsArray()
  participants: UserReferenceDto[]
}
