import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bull'
import { UserView } from 'src/auth/user/entity/user-view.entity'
import { PostViewService } from 'src/post/post-view/post-view.service'
import { Repository } from 'typeorm'

@Processor('view')
export class ViewConsumer {
  private readonly logger = new Logger(ViewConsumer.name)
  constructor(@InjectRepository(UserView) private readonly viewRepo: Repository<UserView>, private readonly postViewService: PostViewService) {}
  @Process('post')
  async viewPost(job: Job<any>) {
    this.logger.debug('Inside view post queue processor')

    this.postViewService.viewPost(job.data.postId, job.data.user)
  }

  @Process('user')
  async viewUser(job: Job<UserView>) {
    this.logger.debug('Inside view User queue processor')
    this.viewRepo.save(job.data)
  }
}
