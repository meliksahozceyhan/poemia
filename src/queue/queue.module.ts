import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ViewConsumer } from './consumers/view-consumer'
import { PostModule } from 'src/post/post.module'

@Module({
  imports: [BullModule.registerQueue({ name: 'view' }), PostModule],
  providers: [ViewConsumer]
})
export class QueueModule {}
