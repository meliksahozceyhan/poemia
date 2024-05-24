import { Injectable } from '@nestjs/common'
import { WebSocketServer } from '@nestjs/websockets'
import { RoomRedisService } from 'src/redis/service/room.redis.service'
import { UserRedisService } from 'src/redis/service/user.redis.service'
import { Server } from 'socket.io'
import { RoomService } from '../room/room.service'

@Injectable()
export class SocketService {
  @WebSocketServer() server: Server
  constructor(
    private readonly userRedisService: UserRedisService,
    private readonly roomRedisService: RoomRedisService,
    private readonly roomService: RoomService
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

  public async getGeneralRoomId(language: string) {
    return await this.roomRedisService.getGeneralRoomId(language)
  }

  public async setGeneralRooms(language: string, roomId: string) {
    return await this.roomRedisService.setGeneralRooms(language, roomId)
  }

  public async initGeneralChat() {
    const generalRooms = await this.roomService.getGeneralRoomIds()
    generalRooms.forEach((room) => {
      this.setGeneralRooms(room.language, room.id)
    })
  }
}
