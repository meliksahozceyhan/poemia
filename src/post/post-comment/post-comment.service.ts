import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostComment } from './entity/post-comment.entity'
import { Repository } from 'typeorm'
import { PostCommentCreateDto } from './dto/post-comment-create.dto'
import { User } from 'src/auth/user/entity/user.entity'
import { PageResponse } from 'src/sdk/PageResponse'

@Injectable()
export class PostCommentService {
  constructor(@InjectRepository(PostComment) private readonly repo: Repository<PostComment>) {}

  public async createCommentOnPost(postId: string, postCommentCreateDto: PostCommentCreateDto, user: User): Promise<PostComment> {
    const postComment = { post: { id: postId }, content: postCommentCreateDto.content, user, commentTo: { id: postCommentCreateDto.comment?.id } }
    /* postComment.post = { id: postId }
    postComment.content = postComment.content
    postComment.user = user
    postComment.commentTo.id = postCommentCreateDto.comment.id */
    return await this.repo.save(postComment)
  }

  public async getCommentsOfPost(postId: string, page: number, size: number) {
    const response = await this.repo.findAndCount({
      where: { post: { id: postId } },
      skip: page * size,
      order: { createdAt: 'DESC' },
      take: size
    })

    return new PageResponse(response, page, size)
  }
}
