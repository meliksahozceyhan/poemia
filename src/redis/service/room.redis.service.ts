import { Injectable } from '@nestjs/common'
import { RedisRepository } from '../infrastructure/repository/redis.repository'
import { RedisPrefixEnum } from '../infrastructure/enums/RedisPrefixEnum'

@Injectable()
export class RoomRedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  public async saveParticipantsOfRoomToCache(roomId: string, participants: string[]) {
    return await this.redisRepository.addItemToSet(RedisPrefixEnum.ROOM, roomId, participants)
  }

  public async getParticipantsOfRoom(roomId: string) {
    return await this.redisRepository.getMembersOfSet(RedisPrefixEnum.ROOM, roomId)
  }

  public async removeParticipantsFromRoom(roomId: string, participants: string[]) {
    return await this.redisRepository.removeItemFromSet(RedisPrefixEnum.ROOM, roomId, participants)
  }

  public async getGeneralRoomId(language: string) {
    return await this.redisRepository.get(RedisPrefixEnum.GENERAL_ROOM, language)
  }

  public async setGeneralRooms(language: string, roomId: string) {
    return await this.redisRepository.set(RedisPrefixEnum.GENERAL_ROOM, language, roomId)
  }
}
