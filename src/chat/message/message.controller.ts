import { Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Put, Query } from '@nestjs/common'
import { MessageService } from './message.service'
import { ApiOkResponsePaginated } from 'src/sdk/swagger-helper/api-ok-response-paginated'
import { Message } from './entity/message.entity'
import { MessageViewService } from './message-view.service'
import { ApiOkResponse, ApiParam } from '@nestjs/swagger'
import { MessageView } from './entity/message-view.entity'
import { CurrentUser } from 'src/decorators/decorators'
import { User } from 'src/auth/user/entity/user.entity'

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageViewService: MessageViewService
  ) {}

  @Get()
  @ApiOkResponsePaginated(Message)
  public async getAllByRoom(
    @Query('roomId', ParseUUIDPipe) roomId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number
  ) {
    return await this.messageService.getMessagesOfRoom(roomId, page, size)
  }

  @Put(':roomId')
  @ApiOkResponse({ type: MessageView, description: ' Update isRead Property of the unread messages for the user.' })
  @ApiParam({ name: 'roomId', description: 'Room Id which the messages will be read.' })
  public async updateIsReadOfUserByRoom(@Param('roomId', ParseUUIDPipe) roomId: string, @CurrentUser() user: User): Promise<void> {
    await this.messageViewService.readUnreadMessagesOfRoom(roomId, user.id)
  }
}
