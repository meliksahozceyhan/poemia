import { Module, forwardRef } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageController } from './message.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './entity/message.entity'
import { MessageView } from './entity/message-view.entity'
import { MessageViewService } from './message-view.service'
import { BullModule } from '@nestjs/bull'
import { RoomModule } from '../room/room.module'
import { SocketModule } from '../socket/socket.module'

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageView]), forwardRef(() => SocketModule), BullModule.registerQueue({ name: 'view' }), RoomModule],
  controllers: [MessageController],
  providers: [MessageService, MessageViewService],
  exports: [MessageService, MessageViewService]
})
export class MessageModule {}
