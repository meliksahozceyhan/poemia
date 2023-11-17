import { Module } from '@nestjs/common'
import { StoryController } from './story.controller'
import { StoryService } from './story.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Story } from './entity/story.entity'
import { StoryView } from './story-view/entity/story-view.entity'
import { StoryViewService } from './story-view/story-view.service'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [TypeOrmModule.forFeature([Story, StoryView]), BullModule.registerQueue({ name: 'view' })],
  controllers: [StoryController],
  providers: [StoryService, StoryViewService],
  exports: [StoryViewService, StoryService]
})
export class StoryModule {}
