import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostView } from './entity/post-view.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class PostViewService {
  constructor(@InjectRepository(PostView) private readonly repo: Repository<PostView>) {}

  public async viewPost(postId: string, user: User): Promise<PostView> {
    const entity = this.repo.create()
    entity.post.id = postId
    entity.user = user
    return await this.repo.save(entity)
  }
}
