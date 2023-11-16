import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { PostRepost } from './entity/post-repost.entity'
import { EntityManager, Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'
import { PostService } from '../post.service'
import { PageResponse } from 'src/sdk/PageResponse'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { Post } from '../entity/post.entity'

@Injectable()
export class PostRepostService {
  constructor(
    @InjectRepository(PostRepost) private readonly repo: Repository<PostRepost>,
    private readonly postService: PostService,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  public async repostPost(postId: string, user: User) {
    const entity = this.repo.create()
    const post = await this.postService.findById(postId)
    if (post.user.id === user.id) {
      throw new BasePoemiaError('post.cannotRepostSelfPost')
    }

    entity.user = user
    entity.post = post

    return await this.repo.save(entity)
  }

  public async getPostIdsOfRepostsOfUser(userId: string, page: number, size: number) {
    const response = await this.repo.find({
      select: { post: { id: true } },
      where: { user: { id: userId } },
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' }
    })

    return response.map((val) => val.post.id)
  }

  public async getRepostsOfUserWithAnotherUser(userId: string, page: number, size: number, self: User) {
    const postIds = await this.getPostIdsOfRepostsOfUser(userId, page, size)
    const queryBuilder = this.entityManager.createQueryBuilder(Post, 'post')
    const result = await queryBuilder
      .leftJoinAndMapOne('post.user', 'post.user', 'user', 'post.user.id = user.id')
      .loadRelationCountAndMap('post.viewCount', 'post.views', 'postView')
      .loadRelationCountAndMap('post.likeCount', 'post.likes', 'postLike', (qb) => qb.andWhere({ isSuper: false }))
      .loadRelationCountAndMap('post.superLikeCount', 'post.likes', 'postLike', (qb) => qb.andWhere({ isSuper: true }))
      .loadRelationCountAndMap('post.commentCount', 'post.comments', 'postComment')
      .loadRelationCountAndMap('post.repostCount', 'post.reposts', 'postRepost')
      .leftJoinAndMapOne('post.isHighlighted', 'post.highlights', 'postHighlight', 'postHighlight.expiresAt > now()')
      .leftJoinAndMapOne('post.isLiked', 'post.likes', 'postLiked', 'postLiked.user.id = :userId', { userId: self.id })
      .leftJoinAndMapOne('post.isRepoemed', 'post.reposts', 'postResposted', 'postResposted.user.id = :userId', { userId: self.id })
      .leftJoinAndMapOne('user.isFollowed', 'user.followers', 'userFollows', 'userFollows.follower.id = :userId', { userId: self.id })
      .leftJoinAndMapOne('post.lastComment', 'post.comments', 'lastComment', 'lastComment.post.id = post.id')
      .leftJoinAndMapOne('lastComment.user', 'lastComment.user', 'user2', 'lastComment.user.id = user2.id')
      .leftJoinAndMapOne('lastComment.mention', 'lastComment.mention', 'mention', 'lastComment.mention.id = mention.id')
      .leftJoinAndMapOne('post.lastLike', 'post.likes', 'lastLike', 'lastLike.post.id = post.id')
      .leftJoinAndMapOne('lastLike.user', 'lastLike.user', 'user3', 'lastLike.user.id = user3.id')
      .leftJoinAndMapMany('post.taggedUsers', 'post.taggedUsers', 'taggedUsers')
      .whereInIds(postIds)
      .getManyAndCount()

    /*  const sql = await queryBuilder.getSql()
    console.log(sql) */
    return new PageResponse(result, page, size)
  }
}
