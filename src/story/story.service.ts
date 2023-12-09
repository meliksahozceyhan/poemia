import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Story } from './entity/story.entity'
import { EntityManager, MoreThan, Not, Repository } from 'typeorm'
import { CreateStoryDto } from './dto/create-story.dto'
import { User } from 'src/auth/user/entity/user.entity'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { PageResponse } from 'src/sdk/PageResponse'

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story) private readonly repo: Repository<Story>,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  public async createStory(createStoryDto: CreateStoryDto, user: User) {
    if ((await this.checkIfUserHasActiveStory(user)) > 0) {
      throw new BasePoemiaError('You can not create story because you have a active story')
    }
    const story = this.repo.create()
    Object.assign(story, createStoryDto)
    story.user = user
    const now = new Date()
    now.setDate(now.getDate() + 1)
    story.expiresAt = now
    return await this.repo.save(story)
  }

  public async checkIfUserHasActiveStory(user: User) {
    return await this.repo.count({
      select: { id: true },
      where: {
        user: { id: user.id },
        expiresAt: MoreThan(new Date())
      }
    })
  }

  public async getActiveStoryOfUser(user: User) {
    return await this.repo.findOne({
      where: {
        user: {
          id: user.id
        },
        expiresAt: MoreThan(new Date())
      }
    })
  }

  public async getStoryList(page: number, size: number, user: User): Promise<PageResponse<Story>> {
    const stories = await this.repo.findAndCount({
      where: {
        user: { id: Not(user.id) }
      },
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' }
    })
    return new PageResponse(stories, page, size)
  }

  public async getStoriesWithEm(page: number, size: number, user: User): Promise<PageResponse<Story>> {
    const queryBuilder = this.entityManager.createQueryBuilder(Story, 'story')
    const result = await queryBuilder
      .leftJoinAndMapOne('story.user', 'story.user', 'user', 'story.user.id = user.id')
      .leftJoinAndMapOne('story.isViewed', 'story.views', 'storyView', 'storyView.user.id = :userId', { userId: user.id })
      .leftJoinAndMapOne('user.isBlocks', 'user.blocks', 'userBlocks', 'userBlocks.blocks.id = :user', { user: user.id })
      .leftJoinAndMapOne('user.isBlocked', 'user.blockedBy', 'userBlocked', 'userBlocked.blockedBy.id = :user2', { user2: user.id })
      .where('story.user.id != :userId AND story.expiresAt > :expiresAt', { userId: user.id, expiresAt: new Date() })
      .andWhere('story.language = :language', { language: user.language })
      .andWhere('userBlocked.id IS NULL AND userBlocks.id IS NULL')
      .skip(page * size)
      .take(size)
      .getManyAndCount()

    return new PageResponse(result, page, size)
  }
}
