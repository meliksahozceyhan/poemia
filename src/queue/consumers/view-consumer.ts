import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { PostViewService } from 'src/post/post-view/post-view.service'

@Processor('view')
export class ViewConsumer {
  constructor(private readonly postViewService: PostViewService) {}
  @Process('post')
  async viewPost(job: Job<any>) {
    this.postViewService.viewPost(job.data.postId, job.data.user)
  }
}
