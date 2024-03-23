import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { SocketService } from './socket.service'

import { Socket, Server } from 'socket.io'
import { Inject, Logger, UsePipes, forwardRef } from '@nestjs/common'
import { MessageDto } from '../message/dto/message.dto'
import { MessageService } from '../message/message.service'
import { ValidationPipe } from '@nestjs/common'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { MessageViewDto } from '../message/dto/message-view.dto'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'

@WebSocketGateway(3001, { namespace: 'socket', cors: '*', transports: 'websocket' })
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(SocketGateway.name)

  constructor(
    private readonly socketService: SocketService,
    @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
    @InjectQueue('view') private readonly viewQueue: Queue
  ) {}
  handleConnection(client: Socket) {
    const userId = client.handshake.query?.id as string

    if (userId) {
      client.join(userId)
      this.socketService.addUserToOnlineList(userId)
      this.logger.debug(client.id + ' connected to self room with id ' + userId)
    } else {
      throw new BasePoemiaError('socket.idRequired')
    }
  }
  handleDisconnect(client: Socket) {
    this.logger.debug(client.id + ' disconnected')
    const userId = client.handshake.query?.id as string
    this.socketService.removeUserFromOnlineList(userId)
  }

  @SubscribeMessage('onNewMessage')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, skipUndefinedProperties: true, enableDebugMessages: true }))
  public async handleNewMessage(@MessageBody() data: MessageDto, @ConnectedSocket() client: Socket) {
    const userId = client.handshake.query?.id as string
    const socketRoomIds = await this.socketService.getUsersOfRoom(data.room.id)
    const result = await this.messageService.saveMessage(data, userId, socketRoomIds)
    client.to(socketRoomIds).emit('onNewMessage', result)
  }

  /**
   * TODO: Add a new message onMessageRead When another person reads the message Send a simple message
   * * { roomId, messageId, readById }
   */

  @SubscribeMessage('readMessage')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, skipUndefinedProperties: true, enableDebugMessages: true }))
  public async handleOnMessageView(@MessageBody() data: MessageViewDto, @ConnectedSocket() client: Socket) {
    const userId = client.handshake.query?.id as string
    const socketRoomIds = await this.socketService.getUsersOfRoom(data.roomId)
    await this.viewQueue.add('message', { messageId: data.messageId, userId }, { removeOnComplete: true })
    client.to(socketRoomIds).emit('readMessage', { roomId: data.roomId, messageId: data.messageId, readBy: userId })
  }

  public async notifyClientsOfReadMessages(roomId: string, userId: string) {
    const userIds = await this.socketService.getUsersOfRoom(roomId)
    this.server.to(userIds).emit('notificationsRead', { roomId: roomId, userId: userId })
  }
}
