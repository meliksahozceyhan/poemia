import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from '../dto/register.dto'
import * as bcrypt from 'bcrypt'
import { CheckUsernameDto } from '../dto/check-username.dto'
import { UserLabel } from './entity/user-label.entity'
import { UserAbout } from './entity/user-about.entity'
import { CreateLabelDto } from './dto/label/create-label-dto'
import { CreateAboutDto } from './dto/about/create-about-dto'
import { UserView } from './entity/user-view.entity'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { UserFollow } from './entity/user-follow.entity'
import { UpdateAboutDto } from './dto/about/update-about-dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(UserLabel) private readonly labelRepository: Repository<UserLabel>,
    @InjectRepository(UserAbout) private readonly aboutRepository: Repository<UserAbout>,
    @InjectRepository(UserView) private readonly viewRepository: Repository<UserView>,
    @InjectRepository(UserFollow) private readonly followRepository: Repository<UserFollow>
  ) {}

  public async findUserByUserName(username: string): Promise<User> {
    return await this.repository.findOneByOrFail({ username: username })
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.repository.findOneByOrFail({ email: email })
  }

  public async createUser(registerDto: RegisterDto): Promise<User> {
    registerDto.password = await bcrypt.hash(registerDto.password as string, 10)
    return await this.repository.save(registerDto)
  }

  public async doesUserNameExists(checkUserNameDto: CheckUsernameDto): Promise<boolean> {
    return await this.repository.exist({ where: { username: checkUserNameDto.username } })
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

  public async addLabelToUser(createLabelDto: CreateLabelDto): Promise<UserLabel> {
    return await this.labelRepository.save(createLabelDto)
  }

  public async addAboutToUser(createAboutDto: CreateAboutDto): Promise<UserAbout> {
    return await this.aboutRepository.save(createAboutDto)
  }

  public async updateAboutOfUser(id: string, dto: UpdateAboutDto) {
    const userAbout = await this.aboutRepository.findOneByOrFail({ id: id })
    Object.assign(userAbout, dto)
    return await this.aboutRepository.save(userAbout)
  }

  public async findById(id: string, user: User): Promise<User> {
    if (id !== user.id) {
      this.viewUser(id, user)
    }
    const foundUser = await this.repository.findOneByOrFail({ id: id })
    if (id === foundUser.id) {
      foundUser['self'] = true
    }
    return foundUser
  }

  public async updatePasswordOfUser(newPassword: string, userToSave: User): Promise<User> {
    userToSave.password = await bcrypt.hash(newPassword as string, 10)
    return await this.repository.save(userToSave)
  }

  private async viewUser(userId: string, viewer: User) {
    await this.viewRepository.save({ user: { id: userId }, viewer: viewer, isSecret: viewer.isViewPrivate })
  }

  public async followUser(id: string, follower: User) {
    const user = await this.repository.findOneByOrFail({ id: id })
    if (follower.id === id) {
      throw new BasePoemiaError('user.canNotFollowYourself')
    }
    const followEntity = this.followRepository.create()
    followEntity.follower = follower
    followEntity.user.id = id
    followEntity.isActive = !user.isPrivate

    this.followRepository.save(followEntity)
  }

  //TODO: Profile page details will come  from here
  /* public async getSelfProfile(user: User) {
    const user1 = await this.repository.findOneBy({ id: user.id })
  } */
}
