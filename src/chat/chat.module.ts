import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { MessageModule } from './message/message.module'
import { RoomModule } from './room/room.module'
import { SocketModule } from './socket/socket.module'

@Module({
  providers: [ChatService],
  imports: [MessageModule, RoomModule, SocketModule]
})
export class ChatModule {}
