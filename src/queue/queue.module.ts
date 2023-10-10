import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ViewConsumer } from './consumers/view-consumer'
import { PostModule } from 'src/post/post.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserView } from 'src/auth/user/entity/user-view.entity'

@Module({
  imports: [BullModule.registerQueue({ name: 'view' }), PostModule, TypeOrmModule.forFeature([UserView])],
  providers: [ViewConsumer]
})
export class QueueModule {}
