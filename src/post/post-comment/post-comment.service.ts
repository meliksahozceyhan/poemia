import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { PostComment } from './entity/post-comment.entity'
import { EntityManager, Repository } from 'typeorm'
import { PostCommentCreateDto } from './dto/post-comment-create.dto'
import { User } from 'src/auth/user/entity/user.entity'
import { PageResponse } from 'src/sdk/PageResponse'
import { Post } from '../entity/post.entity'
import { PostCommentLikeService } from './post-comment-like/post-comment-like.service'

@Injectable()
export class PostCommentService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(PostComment) private readonly repo: Repository<PostComment>,
    private readonly postCommentLikeService: PostCommentLikeService
  ) {}

  public async createCommentOnPost(postId: string, postCommentCreateDto: PostCommentCreateDto, user: User): Promise<PostComment> {
    const entity = await this.repo.create()
    Object.assign(entity, postCommentCreateDto)
    entity.user = user
    entity.post = new Post()
    entity.post.id = postId
    return await this.repo.save(entity)
  }

  /*   public async getCommentsOfPost(postId: string, page: number, size: number) {
    const response = await this.repo.findAndCount({
      where: { post: { id: postId } },

      skip: page * size,
      order: { createdAt: 'DESC' },
      take: size
    })

    return new PageResponse(response, page, size)
  } */

  public async getCommentsOfPost(postId: string, page: number, size: number) {
    const queryBuilder = this.entityManager.createQueryBuilder(PostComment, 'postComment')

    const result = await queryBuilder
      .leftJoinAndMapOne('postComment.user', 'postComment.user', 'user', 'postComment.user.id = user.id')
      .leftJoinAndMapOne('postComment.mention', 'postComment.mention', 'mention', 'postComment.mention.id = mention.id')
      .loadRelationCountAndMap('post.likeCount', 'postComment.likes')
      .skip(page * size)
      .take(size)
      //.orderBy('post.postHighlight')
      .addOrderBy('postComment.createdAt')
      .getManyAndCount()

    return new PageResponse(result, page, size)
  }

  public async likeComment(commentId: string, user: User) {
    return this.postCommentLikeService.likeComment(commentId, user)
  }
}
