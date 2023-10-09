import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostComment } from './entity/post-comment.entity'
import { Repository } from 'typeorm'
import { PostCommentCreateDto } from './dto/post-comment-create.dto'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class PostCommentService {
  constructor(@InjectRepository(PostComment) private readonly repo: Repository<PostComment>) {}

  public async createCommentOnPost(postId: string, postCommentCreateDto: PostCommentCreateDto, user: User): Promise<PostComment> {
    const postComment = this.repo.create()
    postComment.post.id = postId
    postComment.content = postComment.content
    postComment.user = user
    postComment.commentTo.id = postCommentCreateDto.comment.id
    return await this.repo.save(postComment)
  }

  public async getCommentsOfPost(postId: string, page: number, size: number) {
    return await this.repo.findAndCount({
      where: { post: { id: postId } },
      skip: page * size,
      order: { createdAt: 'DESC' },
      take: size
    })
  }
}
