import { Module } from '@nestjs/common'
import { RoomService } from './room.service'
import { RoomController } from './room.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from './entity/room.entity'
import { RedisModule } from 'src/redis/redis.module'

@Module({
  imports: [TypeOrmModule.forFeature([Room]), RedisModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule {}
