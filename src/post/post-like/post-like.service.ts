import { InjectRepository } from '@nestjs/typeorm'
import { PostLike } from './entity/post-like.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'
import { PostLikeDto } from './dto/post-like.dto'
import { PostService } from '../post.service'
import { PageResponse } from 'src/sdk/PageResponse'

export class PostLikeService {
  constructor(@InjectRepository(PostLike) private readonly repo: Repository<PostLike>, private readonly postService: PostService) {}

  public async likePost(postId: string, postLikeDto: PostLikeDto, user: User): Promise<PostLike> {
    const post = await this.postService.findById(postId)
    const isPreviouslyLiked = await this.repo.findOne({
      where: {
        post: { id: post.id },
        user: { id: user.id }
      }
    })
    if (isPreviouslyLiked !== null && isPreviouslyLiked !== undefined && postLikeDto.isSuper) {
      return await this.updateLikeToSuperLike(isPreviouslyLiked)
    } else {
      const postLike = this.repo.create()
      postLike.post = post
      postLike.user = user
      postLike.isSuper = postLikeDto.isSuper
      return await this.repo.save(postLike)
    }
  }

  public async getLikesOfPost(postId: string, page: number, size: number) {
    const response = await this.repo.findAndCount({
      where: { post: { id: postId } },
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' }
    })

    return new PageResponse(response, page, size)
  }

  public async updateLikeToSuperLike(postLike: PostLike) {
    postLike.isSuper = true
    return this.repo.save(postLike)
  }
}
