import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserBlocked } from './entity/user-blocked.entity'
import { Repository } from 'typeorm'
import { UserFollow } from './entity/user-follow.entity'
import { UserService } from './user.service'
import { User } from './entity/user.entity'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { PageResponse } from 'src/sdk/PageResponse'

@Injectable()
export class UserActionService {
  constructor(
    @InjectRepository(UserBlocked) private readonly userBlockedRepo: Repository<UserBlocked>,
    @InjectRepository(UserFollow) private readonly userFollowRepo: Repository<UserFollow>,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  public async followUser(id: string, follower: User) {
    const user = await this.userService.findById(id)
    if (follower.id === id) {
      throw new BasePoemiaError('user.canNotFollowYourself')
    }
    const isExistsPreviously = await this.userFollowRepo.findOne({
      where: { user: { id: user.id }, follower: { id: follower.id } }
    })

    if (isExistsPreviously !== null && isExistsPreviously !== undefined) {
      return await this.unfollowUser(isExistsPreviously)
    } else {
      const followEntity = this.userFollowRepo.create()
      followEntity.follower = follower
      followEntity.user = user
      followEntity.isActive = !user.isPrivate

      return await this.userFollowRepo.save(followEntity)
    }
  }

  public async blockUser(id: string, user: User) {
    const blockEntity = { blockedBy: { id: user.id }, blocks: { id: id } }

    return await this.userBlockedRepo.save(blockEntity)
  }

  public async unfollowUser(userfollowEntity: UserFollow) {
    await this.userFollowRepo.remove(userfollowEntity)
  }

  public async getFollowersOfUser(id: string) {
    const res = await this.userBlockedRepo.query(
      `
			SELECT user_id FROM public.user_follow WHERE follower_id = $1
		`,
      [id]
    )
    return res.map((val) => val.user_id)
  }

  public async getBlockedOrBlockedByOdUsers(id: string) {
    const res = await this.userBlockedRepo.query(
      `
			SELECT blocked_by from public.user_blocked WHERE blocks_id = $1 
		`,
      [id]
    )

    const res2 = await this.userBlockedRepo.query(
      `
			SELECT blocks_id from public.user_blocked WHERE blocked_by = $1
		`,
      [id]
    )
    return res.map((val) => val.blocked_by).concat(res2.map((val) => val.blocks_id))
  }

  public async getExclusiveUserIdsForFeed(id: string) {
    const follow = await this.getFollowersOfUser(id)
    const blocked = await this.getBlockedOrBlockedByOdUsers(id)
    return [...new Set(follow.concat(blocked))]
  }

  public async getFollowRequests(user: User, page: number, size: number): Promise<PageResponse<UserFollow>> {
    const result = await this.userFollowRepo.findAndCount({
      where: {
        user: { id: user.id },
        isActive: false
      },
      order: {
        createdAt: 'DESC'
      },
      skip: page * size,
      take: size
    })

    return new PageResponse(result, page, size)
  }

  public async approveFollowRequest(id: string, user: User) {
    const userFollow = await this.userFollowRepo.findOneByOrFail({ id: id })
    if (userFollow.user.id !== user.id) {
      throw new BasePoemiaError('userFollow.notSelfRequest')
    }
    userFollow.isActive = true
    this.userFollowRepo.save(userFollow)
    return userFollow
  }

  public async rejectFollowRequest(id: string, user: User) {
    const userFollow = await this.userFollowRepo.findOneByOrFail({ id: id })
    if (userFollow.user.id !== user.id) {
      throw new BasePoemiaError('userFollow.notSelfRequest')
    }
    this.userFollowRepo.remove(userFollow)
    return id
  }
}
