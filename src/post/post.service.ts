import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Post } from './entity/post.entity'
import { Between, EntityManager, Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { User } from 'src/auth/user/entity/user.entity'
import { PageResponse } from 'src/sdk/PageResponse'
import { endOfDay, startOfDay } from 'date-fns'
import { PostHighlightService } from './post-highlight/post-highlight.service'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { LanguageNames } from 'src/util/languages'
import { UserActionService } from 'src/auth/user/user-actions.service'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    @Inject(forwardRef(() => PostHighlightService)) private postHighLightService: PostHighlightService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly userActionsService: UserActionService
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getFeedWithUser(page: number, size: number, userId: string, _language: LanguageNames) {
    /*  const exludeUserIds = await this.userActionsService.getExclusiveUserIdsForFeed(userId)
    console.log(exludeUserIds) */
    const result = await this.getJoinedQueryBuilder(userId)
      //.where('post.language = :language', { language: language })
      .where('userBlocked.id IS NULL AND userBlocks.id IS NULL')
      .andWhere('post.readerVideoPath IS NULL')
      .skip(page * size)
      .take(size)
      .orderBy('postHighlight.expiresAt', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getManyAndCount()

    return new PageResponse(result, page, size)
  }

  public async getReadersVideos(page: number, size: number, userId: string) {
    const result = await this.getJoinedQueryBuilder(userId)
      .where('userBlocked.id IS NULL AND userBlocks.id IS NULL')
      //.andWhere('userFollows.id IS NULL')
      .andWhere('post.readerVideoPath IS NOT NULL')
      .skip(page * size)
      .take(size)
      .orderBy('postHighlight.expiresAt', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getManyAndCount()

    return new PageResponse(result, page, size)
  }

  public async getPostsOfUser(page: number, size: number, userId: string, requestedBy: string) {
    const result = await this.getJoinedQueryBuilder(requestedBy)
      .where('post.user.id = :userId', { userId })
      .skip(page * size)
      .take(size)
      .orderBy('postHighlight.expiresAt', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getManyAndCount()
    return new PageResponse(result, page, size)
  }

  public async getPopularPosts(page: number, size: number, user: User, query: string) {
    const postIds = await this.getPostIdsByLikeCountInLast2Weeks(page, size)
    const result = await this.getJoinedQueryBuilder(user.id)
      //.where('post.language = :language', { language: language })
      .where(
        `
				userBlocked.id IS NULL AND userBlocks.id IS NULL AND post.readerVideoPath IS NULL 
				AND post.walpaperPath IS NULL AND post.videoPath IS NULL
				AND (UPPER(post.content) ILIKE ('%' || :query || '%')
				OR :query1 ILIKE ANY(string_to_array(post.tags,',')))
			`,
        { query: query, query1: query }
      )
      .andWhereInIds(postIds)
      .orderBy('postHighlight.expiresAt', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getManyAndCount()

    return new PageResponse(result, page, size)
  }

  public async getExplore(page: number, size: number, user: User, query: string) {
    //TODO: Change the 2 value to 10 before deploy
    const postIds = await this.getPostIdsByLikeCount(page, size, 2)
    const result = await this.getJoinedQueryBuilder(user.id)
      //.where('post.language = :language', { language: language })
      .where(
        `
				userBlocked.id IS NULL AND userBlocks.id IS NULL AND (post.readerVideoPath IS NOT NULL 
				OR post.walpaperPath IS NOT NULL OR post.videoPath IS NOT NULL )
				AND (UPPER(post.content) ILIKE ('%' || :query || '%')
				OR :query1 ILIKE ANY(string_to_array(post.tags,',')))
			`,
        { query: query, query1: query }
      )
      .andWhereInIds(postIds)
      .getManyAndCount()

    return new PageResponse(result, page, size)
  }

  public async search(page: number, size: number, user: User, query: string) {
    const result = await this.getJoinedQueryBuilder(user.id)
      //.where('post.language = :language', { language: language })
      .where(
        `
				userBlocked.id IS NULL AND userBlocks.id IS NULL AND (UPPER(post.content) ILIKE ('%' || :query || '%')
				OR :query1 ILIKE ANY(string_to_array(post.tags,',')))
			`,
        { query: query, query1: query }
      )

      .skip(page * size)
      .take(size)
      .orderBy('postHighlight.expiresAt', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getManyAndCount()

    return new PageResponse(result, page, size)
  }

  public async getVideos(page: number, size: number, user: User, query: string) {
    const result = await this.getJoinedQueryBuilder(user.id)
      //.where('post.language = :language', { language: language })
      .where(
        `
				userBlocked.id IS NULL AND userBlocks.id IS NULL AND post.videoPath IS NOT NULL
				AND (UPPER(post.content) ILIKE ('%' || :query || '%')
				OR :query1 ILIKE ANY(string_to_array(post.tags,',')))
			`,
        { query: query, query1: query }
      )

      .skip(page * size)
      .take(size)
      .orderBy('postHighlight.expiresAt', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getManyAndCount()
    return new PageResponse(result, page, size)
  }

  private getJoinedQueryBuilder(userId: string) {
    const queryBuilder = this.entityManager.createQueryBuilder(Post, 'post')
    return queryBuilder
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
      .leftJoinAndMapOne('user.isBlocks', 'user.blocks', 'userBlocks', 'userBlocks.blocks.id = :userId', { userId })
      .leftJoinAndMapOne('user.isBlocked', 'user.blockedBy', 'userBlocked', 'userBlocked.blockedBy.id = :userId', { userId })
      .leftJoinAndMapOne('post.lastComment', 'post.comments', 'lastComment', 'lastComment.post.id = post.id')
      .leftJoinAndMapOne('lastComment.user', 'lastComment.user', 'user2', 'lastComment.user.id = user2.id')
      .leftJoinAndMapOne('lastComment.mention', 'lastComment.mention', 'mention', 'lastComment.mention.id = mention.id')
      .leftJoinAndMapOne('post.lastLike', 'post.likes', 'lastLike', 'lastLike.post.id = post.id')
      .leftJoinAndMapOne('lastLike.user', 'lastLike.user', 'user3', 'lastLike.user.id = user3.id')
      .leftJoinAndMapOne('user.activeStory', 'user.stories', 'userStories', 'userStories.user.id = user.id AND userStories.expiresAt > now()')
      .leftJoinAndMapOne('userStories.user', 'userStories.user', 'user4', 'userStories.user.id = user4.id')
      .leftJoinAndMapOne('post.isSelfPost', 'post.user', 'userSelf', 'post.user.id = userSelf.id AND userSelf.id = :userId', { userId })
      .leftJoinAndMapMany('post.taggedUsers', 'post.taggedUsers', 'taggedUsers')
  }

  public async getPostIdsByLikeCount(page: number, size: number, likeCount: number) {
    const offset = page * size
    const res = await this.entityManager.query(
      `
			SELECT po.id  FROM post po
			LEFT JOIN post_like pl ON pl.post_id = po.id
			GROUP BY po.id
			HAVING count(pl.id) > $1 
			ORDER BY count(pl.id) DESC,  po.created_at DESC
			LIMIT $2 OFFSET $3
		`,
      [likeCount, size, offset]
    )

    return res.map((val) => val.id)
  }

  public async getPostIdsByLikeCountInLast2Weeks(page: number, size: number) {
    const oneWeekBefore = new Date()
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7)
    const offset = page * size
    const res = await this.entityManager.query(
      `
			SELECT po.id  FROM post po
			LEFT JOIN post_like pl ON pl.post_id = po.id AND pl.created_at > $1
			GROUP BY po.id
			ORDER BY count(pl.id) DESC,  po.created_at DESC
			LIMIT $2 OFFSET $3
		`,
      [oneWeekBefore, size, offset]
    )

    return res.map((val) => val.id)
  }
}
