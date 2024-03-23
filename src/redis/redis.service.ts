import { Injectable } from '@nestjs/common'
import { RedisRepository } from './infrastructure/repository/redis.repository'

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}
}
