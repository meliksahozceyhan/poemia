import { Module } from '@nestjs/common'
import { redisClientFactory } from './infrastructure/redis.client.factory'
import { RedisRepository } from './infrastructure/repository/redis.repository'
import { RedisService } from './redis.service'
import { RoomRedisService } from './service/room.redis.service'
import { UserRedisService } from './service/user.redis.service'

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisRepository, RedisService, RoomRedisService, UserRedisService],
  exports: [RedisService, RoomRedisService, UserRedisService]
})
export class RedisModule {}
