import { Module, forwardRef } from '@nestjs/common'
import { SocketService } from './socket.service'
import { SocketGateway } from './socket.gateway'
import { RedisModule } from 'src/redis/redis.module'
import { MessageModule } from '../message/message.module'
import { BullModule } from '@nestjs/bull'
import { RoomModule } from '../room/room.module'

@Module({
  imports: [RedisModule, BullModule.registerQueue({ name: 'view' }), forwardRef(() => MessageModule), RoomModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService, SocketGateway]
})
export class SocketModule {}
