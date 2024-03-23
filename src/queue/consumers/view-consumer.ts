import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bull'
import { UserView } from 'src/auth/user/entity/user-view.entity'
import { MessageViewService } from 'src/chat/message/message-view.service'
import { PostViewService } from 'src/post/post-view/post-view.service'
import { StoryViewService } from 'src/story/story-view/story-view.service'
import { Repository } from 'typeorm'

@Processor('view')
export class ViewConsumer {
  private readonly logger = new Logger(ViewConsumer.name)
  constructor(
    @InjectRepository(UserView) private readonly viewRepo: Repository<UserView>,
    private readonly postViewService: PostViewService,
    private readonly storyViewService: StoryViewService,
    private readonly messageViewService: MessageViewService
  ) {}
  @Process('post')
  async viewPost(job: Job<any>) {
    this.logger.debug('Inside view post queue processor')

    this.postViewService.viewPost(job.data.postId, job.data.user)
  }

  @Process('user')
  async viewUser(job: Job<UserView>) {
    this.logger.debug('Inside view User queue processor')
    try {
      this.viewRepo.save(job.data)
    } catch (error) {
      this.logger.error(error)
    }
  }

  @Process('story')
  async viewStory(job: Job<any>) {
    this.logger.debug('Inside View Story queue processor')
    await this.storyViewService.viewStory(job.data.storyId, job.data.user)
  }

  @Process('message')
  async viewMessage(job: Job<any>) {
    this.logger.debug('Inside View Message Queue Processor')
    await this.messageViewService.viewMessage(job.data.messageId, job.data.userId)
  }

  @Process('message:create')
  async createViewEntity(job: Job<any>) {
    this.logger.debug('Inside Create View Message Queue Processor')
    await this.messageViewService.createMessageReadEntitiesForUsers(job.data.messageId, job.data.userIds, job.data.sentBy)
  }
}
