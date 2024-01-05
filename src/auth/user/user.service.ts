import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { EntityManager, ILike, Repository } from 'typeorm'
import { RegisterDto } from '../dto/register.dto'
import * as bcrypt from 'bcrypt'
import { UserAbout } from './entity/user-about.entity'
import { CreateAboutDto } from './dto/about/create-about-dto'
import { UserView } from './entity/user-view.entity'
import { UpdateAboutDto } from './dto/about/update-about-dto'
import { UserNameChangeDto } from './dto/detail/user-name-change-dto'
import { UserNameChange } from './entity/user-name-change.entity'
import { FcmTokenUpdateDto } from './dto/fcm-token-update-dto'
import { UpdateUserDto } from './dto/update-user-dto'
import { UserFollow } from './entity/user-follow.entity'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { UserBadge } from './entity/user-badge.entity'
import { PageResponse } from 'src/sdk/PageResponse'
import { StoryService } from 'src/story/story.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(UserAbout) private readonly aboutRepository: Repository<UserAbout>,
    @InjectRepository(UserView) private readonly viewRepository: Repository<UserView>,
    @InjectRepository(UserNameChange) private readonly nameChangeRepo: Repository<UserNameChange>,
    @InjectRepository(UserFollow) private readonly userFollowRepo: Repository<UserFollow>,
    @InjectRepository(UserBadge) private readonly userbadgeRepo: Repository<UserBadge>,
    @Inject(forwardRef(() => StoryService)) private storyService: StoryService,
    @InjectQueue('view') private readonly viewQueue: Queue,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  public async findUserByUserName(username: string): Promise<User> {
    return await this.repository.findOneByOrFail({ username: username })
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.repository.findOneByOrFail({ email: email })
  }

  public async findById(id: string): Promise<User> {
    const foundUser = await this.repository.findOneByOrFail({ id: id })
    foundUser['self'] = true
    foundUser['views'] = await this.viewRepository.count({ select: { id: true }, where: { user: { id: foundUser.id } } })
    foundUser['followerCount'] = await this.userFollowRepo.count({ select: { id: true }, where: { user: { id: foundUser.id } } })
    foundUser['followingCount'] = await this.userFollowRepo.count({ select: { id: true }, where: { follower: { id: foundUser.id } } })
    foundUser['badgeCount'] = await this.userbadgeRepo.count({ select: { id: true }, where: { user: { id: foundUser.id } } })
    foundUser.activeStory = await this.storyService.getActiveStoryOfUser(foundUser)
    return foundUser
  }

  public async createUser(registerDto: RegisterDto): Promise<User> {
    registerDto.password = await bcrypt.hash(registerDto.password as string, 10)
    return await this.repository.save(registerDto)
  }

  public async doesUserNameExists(username: string): Promise<boolean> {
    return await this.repository.exist({ where: { username: username } })
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return await this.repository.findOne({ where: { phoneNumber: phoneNumber } })
  }

  public async activateUser(user: User) {
    user.isActive = true
    return await this.repository.save(user)
  }

  public async findAndActivateUserByPhoneNumber(phoneNumber: string) {
    const user = await this.repository.findOneByOrFail({ phoneNumber: phoneNumber })
    user.isActive = true
    return await this.repository.save(user)
  }

  public async findAndActivateUserByEmail(email: string) {
    const user = await this.repository.findOneByOrFail({ email: email })
    user.isActive = true
    return await this.repository.save(user)
  }

  public async addAboutToUser(createAboutDto: CreateAboutDto, user: User): Promise<UserAbout> {
    const userAbout = this.aboutRepository.create()
    Object.assign(userAbout, createAboutDto)
    userAbout.user = user
    return await this.aboutRepository.save(userAbout)
  }

  public async updateAboutOfUser(id: string, dto: UpdateAboutDto) {
    const userAbout = await this.aboutRepository.findOneByOrFail({ id: id })
    Object.assign(userAbout, dto)
    return await this.aboutRepository.save(userAbout)
  }

  public async getById(id: string, user: User): Promise<User> {
    if (id !== user.id) {
      this.viewUser(id, user)
    }
    const foundUser = await this.repository.findOneByOrFail({ id: id })
    if (user.id === foundUser.id) {
      foundUser['self'] = true
      foundUser['views'] = await this.viewRepository.count({ select: { id: true }, where: { user: { id: foundUser.id } } })
    }
    foundUser['followerCount'] = await this.userFollowRepo.count({ select: { id: true }, where: { user: { id: foundUser.id } } })
    foundUser['followingCount'] = await this.userFollowRepo.count({ select: { id: true }, where: { follower: { id: foundUser.id } } })
    foundUser['badgeCount'] = await this.userbadgeRepo.count({ select: { id: true }, where: { user: { id: foundUser.id } } })
    foundUser.activeStory = await this.storyService.getActiveStoryOfUser(foundUser)
    foundUser.isFollowed = await this.userFollowRepo.findOne({ where: { follower: { id: user.id }, user: { id: foundUser.id } } })
    return foundUser
  }

  public async updatePasswordOfUser(newPassword: string, userToSave: User): Promise<User> {
    userToSave.password = await bcrypt.hash(newPassword as string, 10)
    return await this.repository.save(userToSave)
  }

  public async changeUsername(usernameChangeDto: UserNameChangeDto, user: User): Promise<UserNameChange> {
    //TODO: Uncomment this section.
    /*  if (this.nameChangeRepo.exist({ where: { expiresAt: MoreThan(new Date()) } })) {
      throw new BasePoemiaError('You have changed your username less than 15 days ago')
    } */
    const entity = await this.repository.findOneByOrFail({ id: user.id })
    entity.username = usernameChangeDto.name
    await this.updateUser(user.id, entity, user)
    const changeEntity = this.nameChangeRepo.create()
    changeEntity.user = entity
    changeEntity.before = user.username
    changeEntity.after = entity.username
    const now = new Date()
    now.setDate(now.getDate() + 14)
    changeEntity.expiresAt = now

    return await this.nameChangeRepo.save(changeEntity)
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto, currentUser: User) {
    if (id !== currentUser.id) {
      throw new UnauthorizedException('updateUser.notSelf')
    }
    const entity = await this.repository.findOneByOrFail({ id: id })
    Object.assign(entity, updateUserDto)
    return await this.repository.save(entity)
  }

  public async deleteByEmail(email: string) {
    return await this.repository.delete({ email: email })
  }

  private async viewUser(userId: string, viewer: User) {
    await this.viewQueue.add('user', { user: { id: userId }, viewer: viewer, isSecret: viewer.isViewPrivate }, { removeOnComplete: true })
  }

  public async updateFcmToken(userId: string, fcmTokenUpdateDto: FcmTokenUpdateDto): Promise<User> {
    const user = await this.findById(userId)
    if (user.fcmToken === fcmTokenUpdateDto.fcmToken) {
      return user
    } else {
      user.fcmToken = fcmTokenUpdateDto.fcmToken
      return await this.repository.save(user)
    }
  }

  public async saveUser(user: User) {
    return await this.repository.save(user)
  }

  public async getFollowersOfUser(id: string, page: number, size: number) {
    const result = await this.userFollowRepo.findAndCount({
      where: {
        user: { id: id },
        isActive: true
      },
      skip: page * size,
      take: size,
      order: { createdAt: 'desc' }
    })
    return new PageResponse(result, page, size)
  }

  public async getFollowingsOfUser(id: string, page: number, size: number) {
    const result = await this.userFollowRepo.findAndCount({
      where: {
        follower: { id: id },
        isActive: true
      },
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' }
    })
    return new PageResponse(result, page, size)
  }

  public async getSelfProfileViewers(page: number, size: number, user: User) {
    const profileViews = await this.viewRepository.findAndCount({
      where: {
        user: {
          id: user.id
        }
      },
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' }
    })

    return new PageResponse(profileViews, page, size)
  }

  public async searchUsersByUsername(username: string, page: number, size: number) {
    const users = await this.repository.findAndCount({
      where: [
        {
          username: ILike(`%${username.toLocaleLowerCase()}%`)
        },
        {
          nameSurname: ILike(`%${username.toLocaleLowerCase()}%`)
        }
      ],
      skip: page * size,
      take: size,
      order: { username: 'ASC' }
    })
    return new PageResponse(users, page, size)
  }

  public async searchWithActiveStory(username: string, userId: string, page: number, size: number) {
    const res = await this.entityManager
      .createQueryBuilder(User, 'user')
      .leftJoinAndMapOne('user.isFollowed', 'user.followers', 'userFollows', 'userFollows.follower.id = :userId', { userId })
      .leftJoinAndMapOne('user.isBlocks', 'user.blocks', 'userBlocks', 'userBlocks.blocks.id = :userId', { userId })
      .leftJoinAndMapOne('user.isBlocked', 'user.blockedBy', 'userBlocked', 'userBlocked.blockedBy.id = :userId', { userId })
      .leftJoinAndMapOne('userStories.user', 'userStories.user', 'user2', 'userStories.user.id = user2.id')
      .leftJoinAndMapOne('user.activeStory', 'user.stories', 'userStories', 'userStories.user.id = user.id AND userStories.expiresAt > now()')
      .where(`UPPER(user.username) ILIKE ('%' || :username || '%') OR UPPER(user.name_surname) ILIKE ('%' || :username || '%')`, {
        username: username
      })
      .orderBy('user.username', 'ASC')
      .skip(page * size)
      .take(size)
      .getManyAndCount()

    return new PageResponse(res, page, size)
  }

  public async getUserProgress(user: User) {
    const entity = await this.repository.findOneByOrFail({ id: user.id })
    const points = entity.userPoint
    if (points <= 100) {
      return Math.round((20 / 15) * points)
    } else {
      const res = Math.round((points - 100) * 0.05 + 100)
      return res > 120 ? 120 : res
    }
  }

  public async increaseProgressAfterPostCreation(user: User) {
    const entity = await this.repository.findOneByOrFail({ id: user.id })
    entity.userPoint = entity.userPoint + 1
    await this.repository.save(entity)
  }
}
