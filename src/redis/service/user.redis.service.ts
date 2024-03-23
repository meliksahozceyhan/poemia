import { Injectable } from '@nestjs/common'
import { RedisRepository } from '../infrastructure/repository/redis.repository'
import { RedisPrefixEnum } from '../infrastructure/enums/RedisPrefixEnum'

@Injectable()
export class UserRedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  public async addUserToOnlineSet(userId: string) {
    this.redisRepository.addItemToSet(RedisPrefixEnum.ONLINE, 'user', [userId])
  }

  public async removeUserFromOnlineList(userId) {
    this.redisRepository.removeItemFromSet(RedisPrefixEnum.ONLINE, 'user', [userId])
  }
}
