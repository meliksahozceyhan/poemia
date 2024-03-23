import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import { RoomService } from './room.service'
import { ApiBearerAuth, ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Room } from './entity/room.entity'
import { RoomDTO } from './dto/room.dto'
import { CurrentUser } from 'src/decorators/decorators'
import { User } from 'src/auth/user/entity/user.entity'
import { ApiOkResponsePaginated } from 'src/sdk/swagger-helper/api-ok-response-paginated'

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiCreatedResponse({
    description: 'Use this to create a room with designated participants.',
    type: Room
  })
  public async createRoom(@Body() roomDto: RoomDTO, @CurrentUser() user: User): Promise<Room> {
    return await this.roomService.createRoom(roomDto, user)
  }

  @Get()
  @ApiOkResponsePaginated(Room)
  public async getAllByRoom(@Query('page', ParseIntPipe) page: number, @Query('size', ParseIntPipe) size: number, @CurrentUser() user: User) {
    return await this.roomService.getAllRoomsOfUser(page, size, user.id)
  }

  @Get(':id')
  public async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.roomService.getSingleRoom(id)
  }
}
