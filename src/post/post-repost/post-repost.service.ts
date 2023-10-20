import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostRepost } from './entity/post-repost.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'
import { PostService } from '../post.service'
import { PageResponse } from 'src/sdk/PageResponse'

@Injectable()
export class PostRepostService {
  constructor(@InjectRepository(PostRepost) private readonly repo: Repository<PostRepost>, private readonly postService: PostService) {}

  public async repostPost(postId: string, user: User) {
    const entity = this.repo.create()
    const post = await this.postService.findById(postId)

    entity.user = user
    entity.post = post

    return await this.repo.save(entity)
  }

  public async getRepostsOfUser(userId: string, page: number, size: number) {
    const response = await this.repo.findAndCount({
      where: { user: { id: userId } },
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' }
    })

    return new PageResponse(response, page, size)
  }
}
