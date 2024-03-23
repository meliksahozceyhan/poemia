import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'
import { RedisRepositoryInterface } from './interface/redis.repository.interface'

@Injectable()
export class RedisRepository implements OnModuleDestroy, RedisRepositoryInterface {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect()
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`)
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value)
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`)
  }

  async setWithExpiry(prefix: string, key: string, value: string, expiry: number): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry)
  }

  async addItemToSet(prefix: string, key: string, values: string[]): Promise<number> {
    return await this.redisClient.sadd(`${prefix}:${key}`, values)
  }

  async removeItemFromSet(prefix: string, key: string, values: string[]) {
    if (values.length === 0) {
      return 0
    }
    return await this.redisClient.srem(`${prefix}:${key}`, values)
  }

  async getMembersOfSet(prefix: string, key: string) {
    return await this.redisClient.smembers(`${prefix}:${key}`)
  }
}
