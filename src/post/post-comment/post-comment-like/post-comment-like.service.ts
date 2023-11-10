import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostCommentLike } from './entity/post-comment-like.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class PostCommentLikeService {
  constructor(@InjectRepository(PostCommentLike) private repo: Repository<PostCommentLike>) {}

  public async likeComment(commentId: string, user: User) {
    const like = { comment: { id: commentId }, user: user }
    return await this.repo.save(like)
  }
}
