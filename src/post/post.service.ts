import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Post } from './entity/post.entity'
import { Between, EntityManager, Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { User } from 'src/auth/user/entity/user.entity'
import { PageResponse } from 'src/sdk/PageResponse'
import { endOfDay, startOfDay } from 'date-fns'
import { PostHighlightService } from './post-highlight/post-highlight.service'
import { UserService } from 'src/auth/user/user.service'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { LanguageNames } from 'src/util/languages'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    @Inject(forwardRef(() => PostHighlightService)) private postHighLightService: PostHighlightService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly userService: UserService
  ) {}

  public async findById(id: string): Promise<Post> {
    return await this.repo.findOneByOrFail({ id: id })
  }

  public async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    if (!user.isPremium && (await this.countPostSharedByUserDaily(user)) > 10) {
      throw new BasePoemiaError('post.limitExceeded')
    }
    const entity = this.repo.create()
    Object.assign(entity, createPostDto)
    entity.user = user
    const result = await this.repo.save(entity)
    if (createPostDto.isHighlighted) {
      await this.postHighLightService.highlightPost(result.id, user)
    }
    return result
  }

  public async countByUser(user: User): Promise<number> {
    return await this.repo.count({ select: { id: true }, where: { user: { id: user.id } } })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getPostList(page: number, size: number, user: User) {
    const response = await this.repo.findAndCount({
      take: size,
      skip: page * size,
      order: { createdAt: 'DESC' }
    })
    return new PageResponse(response, page, size)
  }

  public async countPostSharedByUserDaily(user: User) {
    const dateStart = new Date()
    const startDate = startOfDay(dateStart)
    const endDate = endOfDay(dateStart)

    return await this.repo.count({
      select: { id: true },
      where: {
        createdAt: Between(startDate, endDate),
        user: { id: user.id }
      }
    })
  }

  public async getFeedWithUser(page: number, size: number, userId: string, language: LanguageNames) {
    const queryBuilder = this.entityManager.createQueryBuilder(Post, 'post')
    const result = await queryBuilder
      .leftJoinAndMapOne('post.user', 'post.user', 'user', 'post.user.id = user.id')
      .loadRelationCountAndMap('post.viewCount', 'post.views', 'postView')
      .loadRelationCountAndMap('post.likeCount', 'post.likes', 'postLike', (qb) => qb.andWhere({ isSuper: false }))
      .loadRelationCountAndMap('post.superLikeCount', 'post.likes', 'postLike', (qb) => qb.andWhere({ isSuper: true }))
      .loadRelationCountAndMap('post.commentCount', 'post.comments', 'postComment')
      .loadRelationCountAndMap('post.repostCount', 'post.reposts', 'postRepost')
      .leftJoinAndMapOne('post.isHighlighted', 'post.highlights', 'postHighlight', 'postHighlight.expiresAt > now()')
      .leftJoinAndMapOne('post.isLiked', 'post.likes', 'postLiked', 'postLiked.user.id = :userId', { userId })
      .leftJoinAndMapOne('post.isRepoemed', 'post.reposts', 'postResposted', 'postResposted.user.id = :userId', { userId })
      .leftJoinAndMapOne('user.isFollowed', 'user.followers', 'userFollows', 'userFollows.follower.id = :userId', { userId })
      .leftJoinAndMapOne('post.lastComment', 'post.comments', 'lastComment', 'lastComment.post.id = post.id')
      .leftJoinAndMapOne('lastComment.user', 'lastComment.user', 'user2', 'lastComment.user.id = user2.id')
      .leftJoinAndMapOne('lastComment.mention', 'lastComment.mention', 'mention', 'lastComment.mention.id = mention.id')
      .leftJoinAndMapOne('post.lastLike', 'post.likes', 'lastLike', 'lastLike.post.id = post.id')
      .leftJoinAndMapOne('lastLike.user', 'lastLike.user', 'user3', 'lastLike.user.id = user3.id')
      .leftJoinAndMapOne('user.activeStory', 'user.stories', 'userStories', 'userStories.user.id = user.id AND userStories.expiresAt > now()')
      .leftJoinAndMapMany('post.taggedUsers', 'post.taggedUsers', 'taggedUsers')
      .where('post.language = :language', { language: language })
      .skip(page * size)
      .take(size)
      //.orderBy('post.postHighlight')
      .addOrderBy('post.createdAt')
      .getManyAndCount()

    /*  const sql = await queryBuilder.getSql()
    console.log(sql) */
    return new PageResponse(result, page, size)
  }

  public async getPostsOfUser(page: number, size: number, userId: string, requestedBy: string) {
    const queryBuilder = this.entityManager.createQueryBuilder(Post, 'post')
    const result = await queryBuilder
      .leftJoinAndMapOne('post.user', 'post.user', 'user', 'post.user.id = user.id')
      .loadRelationCountAndMap('post.viewCount', 'post.views', 'postView')
      .loadRelationCountAndMap('post.likeCount', 'post.likes', 'postLike', (qb) => qb.andWhere({ isSuper: false }))
      .loadRelationCountAndMap('post.superLikeCount', 'post.likes', 'postLike', (qb) => qb.andWhere({ isSuper: true }))
      .loadRelationCountAndMap('post.commentCount', 'post.comments', 'postComment')
      .loadRelationCountAndMap('post.repostCount', 'post.reposts', 'postRepost')
      .leftJoinAndMapOne('post.isHighlighted', 'post.highlights', 'postHighlight', 'postHighlight.expiresAt > now()')
      .leftJoinAndMapOne('post.isLiked', 'post.likes', 'postLiked', 'postLiked.user.id = :userId', { userId: requestedBy })
      .leftJoinAndMapOne('post.isRepoemed', 'post.reposts', 'postResposted', 'postResposted.user.id = :userId', { userId: requestedBy })
      .leftJoinAndMapOne('user.isFollowed', 'user.followers', 'userFollows', 'userFollows.follower.id = :userId', { userId: requestedBy })
      .leftJoinAndMapOne('post.lastComment', 'post.comments', 'lastComment', 'lastComment.post.id = post.id')
      .leftJoinAndMapOne('lastComment.user', 'lastComment.user', 'user2', 'lastComment.user.id = user2.id')
      .leftJoinAndMapOne('lastComment.mention', 'lastComment.mention', 'mention', 'lastComment.mention.id = mention.id')
      .leftJoinAndMapOne('post.lastLike', 'post.likes', 'lastLike', 'lastLike.post.id = post.id')
      .leftJoinAndMapOne('lastLike.user', 'lastLike.user', 'user3', 'lastLike.user.id = user3.id')
      .where('post.user.id = :userId', { userId })
      .skip(page * size)
      .take(size)
      //.orderBy('post.postHighlight')
      .addOrderBy('post.createdAt')
      .getManyAndCount()

    /*  const sql = await queryBuilder.getSql()
    console.log(sql) */
    return new PageResponse(result, page, size)
  }
}
