import { Injectable } from '@nestjs/common'
import { WebSocketServer } from '@nestjs/websockets'
import { RoomRedisService } from 'src/redis/service/room.redis.service'
import { UserRedisService } from 'src/redis/service/user.redis.service'
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
  @WebSocketServer() server: Server
  constructor(
    private readonly userRedisService: UserRedisService,
    private readonly roomRedisService: RoomRedisService
  ) {}

  public async addUserToOnlineList(userId: string) {
    return await this.userRedisService.addUserToOnlineSet(userId)
  }

  public async removeUserFromOnlineList(userId: string) {
    return await this.userRedisService.removeUserFromOnlineList(userId)
  }

  public async getUsersOfRoom(roomId: string): Promise<string[]> {
    return await this.roomRedisService.getParticipantsOfRoom(roomId)
  }

  public async notifyClientsOfReadMessages(roomId: string, userId: string) {
    const userIds = await this.getUsersOfRoom(roomId)
    this.server.to(userIds).emit('notificationsRead', { roomId: roomId, userId: userId })
  }
}
