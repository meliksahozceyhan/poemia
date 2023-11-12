import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserBlocked } from './entity/user-blocked.entity'
import { Repository } from 'typeorm'
import { UserFollow } from './entity/user-follow.entity'
import { UserService } from './user.service'
import { User } from './entity/user.entity'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'

@Injectable()
export class UserActionService {
  constructor(
    @InjectRepository(UserBlocked) private readonly userBlockedRepo: Repository<UserBlocked>,
    @InjectRepository(UserFollow) private readonly userFollowRepo: Repository<UserFollow>,
    private readonly userService: UserService
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
    const blockEntity = this.userBlockedRepo.create()
    blockEntity.blockedBy = user
    blockEntity.blocks.id = id

    return await this.userBlockedRepo.save(blockEntity)
  }

  public async unfollowUser(userfollowEntity: UserFollow) {
    await this.userFollowRepo.remove(userfollowEntity)
  }
}
