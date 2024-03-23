import { PickType } from '@nestjs/swagger'
import { Room } from '../entity/room.entity'

export class RoomReferenceDto extends PickType(Room, ['id']) {}
