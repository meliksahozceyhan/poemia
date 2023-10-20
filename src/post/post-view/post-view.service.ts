import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostView } from './entity/post-view.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class PostViewService {
  private readonly logger = new Logger(PostViewService.name)
  constructor(@InjectRepository(PostView) private readonly repo: Repository<PostView>) {}

  public async viewPost(postId: string, user: User): Promise<PostView> {
    const entity = { post: { id: postId }, user: user }
    /* entity.post.id = postId
    entity.user = user */

    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
